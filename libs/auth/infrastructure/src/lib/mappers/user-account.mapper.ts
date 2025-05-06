import { Email, Password, UserAccountEntity, Username } from '@nz/auth-domain';
import { UserAccountEntityORM } from '../entities/user-account.entity';

export class UserAccountMapper {
  static toDomain(user: UserAccountEntityORM): UserAccountEntity {
    return UserAccountEntity.restore({
      id: user.id,
      email: Email.create(user.email),
      password: Password.restore(user.passwordHash),
      username: Username.create(user.username),
      emailVerified: user.emailVerified,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
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
