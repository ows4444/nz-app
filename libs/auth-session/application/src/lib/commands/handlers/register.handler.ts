import { ConfigService } from '@nestjs/config';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { RpcException } from '@nestjs/microservices';
import { InjectDataSource } from '@nestjs/typeorm';
import { Email, UserAggregate, UserCredentialEntity, UserEntity, Username } from '@nz/auth-session-domain';
import { TypeormUserCredentialRepository, TypeormUserRepository } from '@nz/auth-session-infrastructure';
import { AuthEnvironment } from '@nz/config';
import { I18nTranslations } from '@nz/shared-i18n';
import { GrpcUnknownException } from '@nz/shared-infrastructure';
import { authSession } from '@nz/shared-proto';
import { I18nService } from 'nestjs-i18n';
import { DataSource } from 'typeorm';
import { RegisterCommand } from '../impl';

@CommandHandler(RegisterCommand)
export class RegisterHandler implements ICommandHandler<RegisterCommand> {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
    private readonly publisher: EventPublisher,
    private readonly i18n: I18nService<I18nTranslations>,
    private readonly userRepository: TypeormUserRepository,
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
        throw new RpcException(this.i18n.translate('error.USER_ALREADY_EXISTS', { lang }));
      }
      const userAggregate = this.publisher.mergeObjectContext(
        new UserAggregate(await this.userRepository.save(UserEntity.register(usernameVo, emailVo, payload.firstName, payload.lastName, lang), queryRunner)),
      );
      await this.userCredentialRepository.save(UserCredentialEntity.createNew(userAggregate.id, payload.password, peppers[defaultPepperVersion], 'bcrypt', defaultPepperVersion), queryRunner);
      await queryRunner.commitTransaction();
      userAggregate.commit();
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
