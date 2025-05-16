import { ConfigService } from '@nestjs/config';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RpcException } from '@nestjs/microservices';
import { InjectDataSource } from '@nestjs/typeorm';

import { AuthEnvironment } from '@nz/config';
import type { UserContactRepository, UserCredentialRepository, UserRepository } from '@nz/iam-domain';
import {
  Email,
  InjectUserContactRepository,
  InjectUserCredentialRepository,
  InjectUserRepository,
  UniqueEntityId,
  UserContactEntity,
  UserCredentialEntity,
  UserEntity,
  Username,
} from '@nz/iam-domain';
import { GrpcAlreadyExistsException, GrpcUnknownException } from '@nz/shared-infrastructure';

import { DataSource } from 'typeorm';

import { RegisterCommand } from '../impl';

@CommandHandler(RegisterCommand)
export class RegisterHandler implements ICommandHandler<RegisterCommand> {
  constructor(
    private readonly configService: ConfigService,
    @InjectDataSource() private readonly dataSource: DataSource,
    @InjectUserRepository() private readonly userRepository: UserRepository,
    @InjectUserCredentialRepository() private readonly userCredentialRepository: UserCredentialRepository,
    @InjectUserContactRepository() private readonly userContactRepository: UserContactRepository,
  ) {}

  async execute({ payload }: RegisterCommand): Promise<any> {
    const userIdVo = UniqueEntityId.generate();
    const emailVo = Email.create(payload.email);
    const usernameVo = Username.create(payload.username);

    const { defaultPepperVersion, peppers } = this.configService.getOrThrow<AuthEnvironment>('auth-env');

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const existing = await this.userRepository.findOneByEmailOrUsername(emailVo, usernameVo);
      if (existing) throw new GrpcAlreadyExistsException('User already exists');

      const newUser = UserEntity.register(userIdVo.getValue(), usernameVo.getValue(), emailVo.getValue());

      const pepper = peppers[defaultPepperVersion];
      const userCredential = UserCredentialEntity.createNew(userIdVo.getValue(), payload.password, pepper, 'bcrypt', defaultPepperVersion);

      const userCredentialId = UniqueEntityId.generate();
      const userContact = UserContactEntity.register(userCredentialId.getValue(), userIdVo.getValue(), 'email', emailVo.getValue());

      const user = await this.userRepository.save(newUser, queryRunner);

      await this.userContactRepository.save(userContact, queryRunner);
      newUser.updatePrimaryContactId(userCredentialId.getValue());
      await this.userRepository.save(newUser, queryRunner);
      await this.userCredentialRepository.save(userCredential, queryRunner);

      await queryRunner.commitTransaction();
      return user;
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
