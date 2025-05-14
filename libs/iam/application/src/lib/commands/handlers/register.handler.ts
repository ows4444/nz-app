import { ConfigService } from '@nestjs/config';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectDataSource } from '@nestjs/typeorm';
import { AuthEnvironment } from '@nz/config';
import type { UserCredentialRepository, UserRepository } from '@nz/iam-domain';
import { Email, InjectUserCredentialRepository, InjectUserRepository, UserCredentialEntity, UserEntity, Username } from '@nz/iam-domain';
import { GrpcAlreadyExistsException } from '@nz/shared-infrastructure';
import { DataSource } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { RegisterCommand } from '../impl';
@CommandHandler(RegisterCommand)
export class RegisterHandler implements ICommandHandler<RegisterCommand> {
  constructor(
    @InjectUserRepository() private readonly userRepository: UserRepository,
    @InjectUserCredentialRepository() private readonly userCredentialRepository: UserCredentialRepository,
    private readonly configService: ConfigService,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async execute({ payload }: RegisterCommand): Promise<any> {
    const emailVo = Email.create(payload.email);
    const usernameVo = Username.create(payload.username);

    const { defaultPepperVersion, peppers } = this.configService.getOrThrow<AuthEnvironment>('auth-env');

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const existing = await this.userRepository.findOneByEmailOrUsername(emailVo, usernameVo);
      if (existing) throw new GrpcAlreadyExistsException('User already exists');

      const newUser = UserEntity.register(uuidv4(), usernameVo.getValue(), emailVo.getValue(), undefined, 'en-US');

      const user = await this.userRepository.create(newUser, queryRunner);
      const pepper = peppers[defaultPepperVersion];
      const userCredential = UserCredentialEntity.createNew(user.id, payload.password, pepper, 'bcrypt', defaultPepperVersion);

      await this.userCredentialRepository.save(userCredential, queryRunner);

      await queryRunner.commitTransaction();
      return user;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
