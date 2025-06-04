import { UserProfileEntity } from '@nz/identity-device-domain';
import { UserProfileEntityORM } from '../entities';

export class UserProfileMapper {
  static toDomain(userProfile: UserProfileEntityORM): UserProfileEntity {
    return UserProfileEntity.restore({
      id: userProfile.id,
      tenantId: userProfile.tenantId,
      firstName: userProfile.firstName,
      lastName: userProfile.lastName,
      displayName: userProfile.displayName,
      locale: userProfile.locale,
      timezone: userProfile.timezone,
      avatarUrl: userProfile.avatarUrl,
      bio: userProfile.bio,
      status: userProfile.status,
      profileVisibility: userProfile.profileVisibility,
      lastLoginAt: userProfile.lastLoginAt,
      createdAt: userProfile.createdAt,
      updatedAt: userProfile.updatedAt,
    });
  }

  static toPersistence(userProfile: UserProfileEntity): Partial<UserProfileEntityORM> {
    return {
      id: userProfile.id,
      tenantId: userProfile.tenantId,
      firstName: userProfile.firstName,
      lastName: userProfile.lastName,
      displayName: userProfile.displayName,
      locale: userProfile.locale,
      timezone: userProfile.timezone,
      avatarUrl: userProfile.avatarUrl,
      bio: userProfile.bio,
      status: userProfile.status,
      profileVisibility: userProfile.profileVisibility,
      lastLoginAt: userProfile.lastLoginAt,
      createdAt: userProfile.createdAt,
      updatedAt: userProfile.updatedAt,
    };
  }
}
