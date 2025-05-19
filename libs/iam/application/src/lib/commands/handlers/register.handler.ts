import { ConfigService } from '@nestjs/config';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RpcException } from '@nestjs/microservices';
import { InjectDataSource } from '@nestjs/typeorm';
import { AuthEnvironment } from '@nz/config';
import type { UserContactRepository, UserCredentialRepository, UserProfileRepository } from '@nz/iam-domain';
import {
  Email,
  InjectUserContactRepository,
  InjectUserCredentialRepository,
  InjectUserProfileRepository,
  UniqueEntityId,
  UserContactEntity,
  UserCredentialEntity,
  Username,
  UserProfileEntity,
} from '@nz/iam-domain';
import { GrpcAlreadyExistsException, GrpcUnknownException } from '@nz/shared-infrastructure';
import { auth } from '@nz/shared-proto';
import { DataSource } from 'typeorm';
import { RegisterCommand } from '../impl';

@CommandHandler(RegisterCommand)
export class RegisterHandler implements ICommandHandler<RegisterCommand> {
  constructor(
    private readonly configService: ConfigService,
    @InjectDataSource() private readonly dataSource: DataSource,
    @InjectUserProfileRepository() private readonly userProfileRepository: UserProfileRepository,
    @InjectUserCredentialRepository() private readonly userCredentialRepository: UserCredentialRepository,
    @InjectUserContactRepository() private readonly userContactRepository: UserContactRepository,
  ) {}

  async execute({ payload }: RegisterCommand): Promise<auth.RegisterResponse> {
    const userIdVo = UniqueEntityId.generate();
    const emailVo = Email.create(payload.email);
    const usernameVo = Username.create(payload.username);

    const { defaultPepperVersion, peppers } = this.configService.getOrThrow<AuthEnvironment>('auth-env');

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const existing = await this.userProfileRepository.findOneByEmailOrUsername(emailVo, usernameVo);
      if (existing) throw new GrpcAlreadyExistsException('User already exists');

      const newUser = UserProfileEntity.register(userIdVo.getValue(), usernameVo.getValue(), emailVo.getValue());

      const pepper = peppers[defaultPepperVersion];
      const userCredential = UserCredentialEntity.createNew(userIdVo.getValue(), payload.password, pepper, 'bcrypt', defaultPepperVersion);

      const userCredentialId = UniqueEntityId.generate();
      const userContact = UserContactEntity.register(userCredentialId.getValue(), userIdVo.getValue(), 'email', emailVo.getValue());

      await this.userProfileRepository.save(newUser, queryRunner);

      await this.userContactRepository.save(userContact, queryRunner);
      newUser.updatePrimaryContactId(userCredentialId.getValue());
      await this.userProfileRepository.save(newUser, queryRunner);
      await this.userCredentialRepository.save(userCredential, queryRunner);

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
