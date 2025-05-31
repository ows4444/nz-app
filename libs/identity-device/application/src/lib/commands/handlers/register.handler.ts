import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { RpcException } from '@nestjs/microservices';
import { InjectDataSource } from '@nestjs/typeorm';
import { Email, UserAggregate, UserContactEntity, Username, UserProfileEntity } from '@nz/identity-device-domain';
import { TypeormUserContactRepository, TypeormUserProfileRepository } from '@nz/identity-device-infrastructure';
import { I18nTranslations } from '@nz/shared-i18n';
import { GrpcAlreadyExistsException, GrpcUnknownException } from '@nz/shared-infrastructure';
import { identityDevice } from '@nz/shared-proto';
import { I18nService } from 'nestjs-i18n';
import { DataSource } from 'typeorm';
import { RegisterCommand } from '../impl';

@CommandHandler(RegisterCommand)
export class RegisterHandler implements ICommandHandler<RegisterCommand> {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly publisher: EventPublisher,
    private readonly i18n: I18nService<I18nTranslations>,
    private readonly userProfileRepository: TypeormUserProfileRepository,
    private readonly userContactRepository: TypeormUserContactRepository,
  ) {}

  async execute({ payload, lang }: RegisterCommand): Promise<identityDevice.RegisterResponse> {
    const emailVo = Email.create(payload.email);
    const usernameVo = Username.create(payload.username);

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const existing = await this.userProfileRepository.findOneByEmailOrUsername(emailVo, usernameVo);

      if (existing) throw new GrpcAlreadyExistsException(this.i18n.translate('error.USER_ALREADY_EXISTS', { lang }));

      const newUser = this.publisher.mergeObjectContext(
        new UserAggregate(await this.userProfileRepository.save(UserProfileEntity.register(usernameVo, emailVo, payload.firstName, payload.lastName, lang), queryRunner)),
      );

      newUser.createUserCredential(payload.password, lang);

      const userContact = UserContactEntity.createNew(newUser.id, 'email', emailVo.getValue());

      await this.userContactRepository.save(userContact, queryRunner);

      await queryRunner.commitTransaction();
      newUser.commit();
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
