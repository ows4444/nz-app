import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import type { ClientGrpc } from '@nestjs/microservices';
import { RpcException } from '@nestjs/microservices';
import { InjectDataSource } from '@nestjs/typeorm';
import { Email, UserContactEntity, Username, UserProfileEntity } from '@nz/identity-device-domain';
import { TypeormUserContactRepository, TypeormUserProfileRepository } from '@nz/identity-device-infrastructure';
import { GrpcAlreadyExistsException, GrpcUnknownException } from '@nz/shared-infrastructure';
import { authSession, identityDevice } from '@nz/shared-proto';
import { lastValueFrom } from 'rxjs';
import { DataSource } from 'typeorm';
import { RegisterCommand } from '../impl';

@CommandHandler(RegisterCommand)
export class RegisterHandler implements ICommandHandler<RegisterCommand> {
  private authSessionServiceClient!: authSession.AuthServiceClient;

  constructor(
    @Inject(authSession.protobufPackage) private readonly grpcClient: ClientGrpc,
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly userProfileRepository: TypeormUserProfileRepository,
    private readonly userContactRepository: TypeormUserContactRepository,
  ) {}

  onModuleInit() {
    this.authSessionServiceClient = this.grpcClient.getService<authSession.AuthServiceClient>(authSession.AUTH_SERVICE_NAME);
  }

  async execute({ payload }: RegisterCommand): Promise<identityDevice.RegisterResponse> {
    const emailVo = Email.create(payload.email);
    const usernameVo = Username.create(payload.username);

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const existing = await this.userProfileRepository.findOneByEmailOrUsername(emailVo, usernameVo);

      if (existing) throw new GrpcAlreadyExistsException('User already exists');

      const newUser = await this.userProfileRepository.save(UserProfileEntity.register(usernameVo, emailVo), queryRunner);

      const userContact = UserContactEntity.createNew(newUser.id, 'email', emailVo.getValue());

      await this.userContactRepository.save(userContact, queryRunner);
      await lastValueFrom(this.authSessionServiceClient.registerCredential({ userId: newUser.id, password: payload.password }));

      await queryRunner.commitTransaction();
      return {
        message: 'User registered successfully',
      };
    } catch (error: unknown) {
      await queryRunner.rollbackTransaction();
      if (error instanceof RpcException) {
        throw error;
      }
      throw new GrpcUnknownException(error as Error);
    } finally {
      await queryRunner.release();
    }
  }
}
