import { UserAccountEntity } from '@nz/domain-auth';
import { UserAccountEntityORM } from '../entities/user-account.entity';

export class UserAccountMapper {
  static toDomain(user: UserAccountEntityORM): UserAccountEntity {
    return new UserAccountEntity({
      id: user.id,
      email: user.email,
      passwordHash: user.passwordHash,
      password: '',
      username: user.username,
      emailVerified: user.emailVerified,
      status: user.status,
    });
  }

  static toPersistence(user: UserAccountEntity): Partial<UserAccountEntityORM> {
    return {
      id: user.id,
      email: user.email,
      passwordHash: user.passwordHash,
      username: user.username,
      emailVerified: user.emailVerified,
      status: user.status,
    };
  }
}
