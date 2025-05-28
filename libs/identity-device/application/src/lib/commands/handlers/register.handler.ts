import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RpcException } from '@nestjs/microservices';
import { InjectDataSource } from '@nestjs/typeorm';
import { Email, UserContactEntity, Username, UserProfileEntity } from '@nz/identity-device-domain';
import { TypeormUserContactRepository, TypeormUserProfileRepository } from '@nz/identity-device-infrastructure';
import { GrpcAlreadyExistsException, GrpcUnknownException } from '@nz/shared-infrastructure';
import { identity } from '@nz/shared-proto';
import { DataSource } from 'typeorm';
import { RegisterCommand } from '../impl';

@CommandHandler(RegisterCommand)
export class RegisterHandler implements ICommandHandler<RegisterCommand> {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    // private readonly configService: ConfigService,
    private readonly userProfileRepository: TypeormUserProfileRepository,
    private readonly userContactRepository: TypeormUserContactRepository,
  ) {}

  async execute({ payload }: RegisterCommand): Promise<identity.RegisterResponse> {
    const emailVo = Email.create(payload.email);
    const usernameVo = Username.create(payload.username);

    // const { defaultPepperVersion, peppers } = this.configService.getOrThrow<AuthEnvironment>('auth-env');

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const existing = await this.userProfileRepository.findOneByEmailOrUsername(emailVo, usernameVo);

      if (existing) throw new GrpcAlreadyExistsException('User already exists');

      const newUser = await this.userProfileRepository.save(UserProfileEntity.register(usernameVo, emailVo), queryRunner);

      //const userCredential = UserCredentialEntity.createNew(newUser.id, payload.password, peppers[defaultPepperVersion], 'bcrypt', defaultPepperVersion);

      const userContact = UserContactEntity.createNew(newUser.id, 'email', emailVo.getValue());

      await this.userContactRepository.save(userContact, queryRunner);
      //await this.userCredentialRepository.save(userCredential, queryRunner);

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
