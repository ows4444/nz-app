import { ConfigService } from '@nestjs/config';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RpcException } from '@nestjs/microservices';
import { InjectDataSource } from '@nestjs/typeorm';
import { UserCredentialEntity } from '@nz/auth-session-domain';
import { TypeormUserCredentialRepository } from '@nz/auth-session-infrastructure';
import { AuthEnvironment } from '@nz/config';
import { GrpcAlreadyExistsException, GrpcUnknownException } from '@nz/shared-infrastructure';
import { authSession } from '@nz/shared-proto';
import { DataSource } from 'typeorm';
import { RegisterCredentialCommand } from '../impl';

@CommandHandler(RegisterCredentialCommand)
export class RegisterCredentialHandler implements ICommandHandler<RegisterCredentialCommand> {
  constructor(@InjectDataSource() private readonly dataSource: DataSource, private readonly configService: ConfigService, private readonly userCredentialRepository: TypeormUserCredentialRepository) {}

  async execute({ payload }: RegisterCredentialCommand): Promise<authSession.RegisterCredentialResponse> {
    const { defaultPepperVersion, peppers } = this.configService.getOrThrow<AuthEnvironment>('auth-env');

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const existing = await this.userCredentialRepository.findOneByUserId(payload.userId, queryRunner);
      if (existing) throw new GrpcAlreadyExistsException('Credential already exists');

      const userCredential = UserCredentialEntity.createNew(payload.userId, payload.password, peppers[defaultPepperVersion], 'bcrypt', defaultPepperVersion);

      await this.userCredentialRepository.save(userCredential, queryRunner);

      await queryRunner.commitTransaction();
      return {
        message: 'Credential registered successfully',
        passwordHash: userCredential.passwordHash,
        success: true,
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
