import { Inject } from '@nestjs/common';
import { UserAccountEntity } from '../entities/user-account.entity';

export const USER_ACCOUNT_REPOSITORY = Symbol('USER_ACCOUNT_REPOSITORY');
export const InjectUserAccountRepository = (): PropertyDecorator & ParameterDecorator => Inject(USER_ACCOUNT_REPOSITORY);

export interface UserAccountRepository {
  create(user: Partial<UserAccountEntity>): Promise<UserAccountEntity>;
  save(user: UserAccountEntity): Promise<UserAccountEntity>;
  findOneById(id: string): Promise<UserAccountEntity>;
  findOneByEmailOrUsername(email: string, username: string): Promise<UserAccountEntity | null>;
  findAll(): Promise<UserAccountEntity[]>;
}
