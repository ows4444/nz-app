import { ConfigService } from '@nestjs/config';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RpcException } from '@nestjs/microservices';
import { InjectDataSource } from '@nestjs/typeorm';
import { Email, GlobalUserCreatedEvent, UserCredentialEntity, UserEntity, Username } from '@nz/auth-session-domain';
import { TypeormUserCredentialRepository, TypeormUserRepository } from '@nz/auth-session-infrastructure';
import { AuthEnvironment } from '@nz/config';
import { OutboxEventEntity } from '@nz/shared-domain';
import { I18nTranslations } from '@nz/shared-i18n';
import { GrpcAlreadyExistsException, GrpcUnknownException, TypeormOutboxEventRepository } from '@nz/shared-infrastructure';
import { authSession } from '@nz/shared-proto';
import { I18nService } from 'nestjs-i18n';
import { DataSource } from 'typeorm';
import { RegisterCommand } from '../impl';

@CommandHandler(RegisterCommand)
export class RegisterHandler implements ICommandHandler<RegisterCommand> {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
    private readonly i18n: I18nService<I18nTranslations>,
    private readonly userRepository: TypeormUserRepository,
    private readonly outboxEventRepository: TypeormOutboxEventRepository,
    private readonly userCredentialRepository: TypeormUserCredentialRepository,
  ) {}

  async execute({ payload, lang }: RegisterCommand): Promise<authSession.RegisterResponse> {
    const { defaultPepperVersion, peppers } = this.configService.getOrThrow<AuthEnvironment>('auth-env');
    const emailVo = Email.create(payload.email);
    const usernameVo = Username.create(payload.username);

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if (await this.userRepository.findOneByEmail(emailVo)) {
        throw new GrpcAlreadyExistsException(this.i18n.translate('error.USER_ALREADY_EXISTS', { lang }));
      }
      const user = await this.userRepository.save(UserEntity.register(usernameVo, emailVo, payload.firstName, payload.lastName, lang), queryRunner);
      await this.userCredentialRepository.save(UserCredentialEntity.createNew(user.id, payload.password, peppers[defaultPepperVersion], 'bcrypt', defaultPepperVersion), queryRunner);

      await this.outboxEventRepository.save(
        OutboxEventEntity.restore(
          new GlobalUserCreatedEvent({
            aggregateId: user.id,
            priority: 1,
            metadata: {},
            deliveryTargets: [{ targetService: 'user-device-service', attempts: 0, delivered: false }],
            maxRetryAttempts: 3,
            createdByService: 'auth-session-service',
            createdByUserId: user.id,
            availableAt: new Date(),
            causationId: user.id,
            correlationId: user.id,
            payload: {
              userId: user.id,
              email: user.email,
              username: user.username,
              firstName: user.firstName,
              lastName: user.lastName,
              deviceId: payload.deviceId,
              deviceInfo: payload.deviceInfo,
              lang,
            },
          }),
        ),
        queryRunner,
      );
      await queryRunner.commitTransaction();
      return {
        message: this.i18n.translate('message.USER_REGISTRATION_SUCCESS', { lang }),
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
