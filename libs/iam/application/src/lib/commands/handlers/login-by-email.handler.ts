import { ConfigService } from '@nestjs/config';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RpcException } from '@nestjs/microservices';
import { InjectDataSource } from '@nestjs/typeorm';
import { AuthEnvironment } from '@nz/config';
import { Email, LoginAttemptEntity, Password } from '@nz/iam-domain';
import { TypeormLoginAttemptRepository, TypeormUserCredentialRepository, TypeormUserProfileRepository } from '@nz/iam-infrastructure';
import { GrpcNotFoundException, GrpcUnauthenticatedException, GrpcUnknownException } from '@nz/shared-infrastructure';
import { auth } from '@nz/shared-proto';
import { DataSource, QueryRunner } from 'typeorm';
import { LoginByEmailCommand } from '../impl';

@CommandHandler(LoginByEmailCommand)
export class LoginByEmailHandler implements ICommandHandler<LoginByEmailCommand> {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
    private readonly userProfileRepository: TypeormUserProfileRepository,
    private readonly userCredentialRepository: TypeormUserCredentialRepository,
    private readonly loginAttemptRepository: TypeormLoginAttemptRepository,
  ) {}

  async execute({ payload }: LoginByEmailCommand): Promise<auth.LoginResponse> {
    const emailVo = Email.create(payload.email);
    const { peppers } = this.configService.getOrThrow<AuthEnvironment>('auth-env');

    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let userProfile = null;

    try {
      userProfile = await this.userProfileRepository.findOneByEmail(emailVo, queryRunner);
      if (!userProfile) {
        throw new GrpcNotFoundException('User not found');
      }

      const userCredential = await this.userCredentialRepository.findOneById(userProfile.id, queryRunner);
      if (!userCredential) {
        throw new GrpcNotFoundException('User credential not found');
      }

      const passwordVo = Password.fromStorage(userCredential);
      const pepper = peppers[userCredential.pepperVersion];
      const isValid = await passwordVo.verify(payload.password, pepper);
      if (!isValid) {
        throw new GrpcUnauthenticatedException('Invalid password');
      }

      const successAttempt = LoginAttemptEntity.createNew(userProfile.id, '0.0.0.0', 'unknown', true, 0);
      await this.loginAttemptRepository.save(successAttempt, queryRunner);

      await queryRunner.commitTransaction();

      const token = '';
      return {
        token,
        message: 'Login successful',
      };
    } catch (error: unknown) {
      await queryRunner.rollbackTransaction();

      if (userProfile) {
        const failedAttempt = LoginAttemptEntity.createNew(userProfile.id, '0.0.0.0', 'unknown', false, 10);
        const tempRunner = this.dataSource.createQueryRunner();
        await tempRunner.connect();
        await tempRunner.startTransaction();
        try {
          await this.loginAttemptRepository.save(failedAttempt, tempRunner);
          await tempRunner.commitTransaction();
        } catch {
          await tempRunner.rollbackTransaction();
        } finally {
          await tempRunner.release();
        }
      }

      if (error instanceof RpcException) {
        throw error;
      }
      throw new GrpcUnknownException(error as Error);
    } finally {
      await queryRunner.release();
    }
  }
}
