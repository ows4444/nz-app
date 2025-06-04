import { UserProfileEntity } from '@nz/identity-device-domain';
import { UserProfileEntityORM } from '../entities';

export class UserProfileMapper {
  static toDomain(user: UserProfileEntityORM): UserProfileEntity {
    return UserProfileEntity.restore({
      id: user.id,
      tenantId: user.tenantId,
      firstName: user.firstName,
      lastName: user.lastName,
      displayName: user.displayName,
      locale: user.locale,
      timezone: user.timezone,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      status: user.status,
      profileVisibility: user.profileVisibility,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }

  static toPersistence(user: UserProfileEntity): Partial<UserProfileEntityORM> {
    return {
      id: user.id,
      tenantId: user.tenantId,
      firstName: user.firstName,
      lastName: user.lastName,
      displayName: user.displayName,
      locale: user.locale,
      timezone: user.timezone,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      status: user.status,
      profileVisibility: user.profileVisibility,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
