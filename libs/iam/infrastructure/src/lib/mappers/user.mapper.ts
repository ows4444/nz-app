import { Email, UserEntity, Username } from '@nz/iam-domain';
import { UserEntityORM } from '../entities/user.entity';

export class UserMapper {
  static toDomain(user: UserEntityORM): UserEntity {
    return UserEntity.restore({
      id: user.id,
      email: Email.create(user.email),
      username: Username.create(user.username),
      status: user.status,

      locale: user.locale,
      phone: user.phone,

      isEmailVerified: user.isEmailVerified,
      isPhoneVerified: user.isPhoneVerified,

      createdAt: user.createdAt,
      updatedAt: user.updatedAt,

      suspendedAt: user.revokedAt,
      suspendedUntil: user.revokedUntil,

      deletedAt: user.deletedAt,
    });
  }

  static toPersistence(user: UserEntity): Partial<UserEntityORM> {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      status: user.status,

      locale: user.locale,
      phone: user.phone,

      isEmailVerified: user.isEmailVerified,
      isPhoneVerified: user.isPhoneVerified,

      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      revokedAt: user.suspendedAt,
      revokedUntil: user.suspendedUntil,

      deletedAt: user.deletedAt,
    };
  }
}
