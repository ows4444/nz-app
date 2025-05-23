import { Email, Username, UserProfileEntity } from '@nz/iam-domain';
import { UserProfileEntityORM } from '../entities';

export class UserProfileMapper {
  static toDomain(user: UserProfileEntityORM): UserProfileEntity {
    return UserProfileEntity.restore({
      id: user.id,
      email: Email.create(user.email),
      username: Username.create(user.username),
      firstName: user.firstName,
      lastName: user.lastName,
      displayName: user.displayName,
      status: user.status,
      deletedAt: user.deletedAt,
      suspendedAt: user.revokedAt,
      suspendedUntil: user.revokedUntil,
      avatar: user.avatar,
      locale: user.locale,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }

  static toPersistence(user: UserProfileEntity): Partial<UserProfileEntityORM> {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      displayName: user.displayName,
      avatar: user.avatar,
      locale: user.locale,
      status: user.status,
      deletedAt: user.deletedAt,
      revokedAt: user.suspendedAt,
      revokedUntil: user.suspendedUntil,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
