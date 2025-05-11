import { Inject } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';
import { Email, Username } from '../value-objects';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');
export const InjectUserRepository = (): PropertyDecorator & ParameterDecorator => Inject(USER_REPOSITORY);

export interface UserRepository {
  create(user: Partial<UserEntity>): Promise<UserEntity>;
  save(user: UserEntity): Promise<UserEntity>;
  findOneById(id: string): Promise<UserEntity>;
  findOneByEmailOrUsername(email: Email, username: Username): Promise<UserEntity | null>;
  findOneByEmail(email: Email): Promise<UserEntity | null>;
  findOneByUsername(username: Username): Promise<UserEntity | null>;
  findAll(): Promise<UserEntity[]>;
}
