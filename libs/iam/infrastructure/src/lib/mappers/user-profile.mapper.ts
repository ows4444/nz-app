import { Email, Username, UserProfileEntity } from '@nz/iam-domain';
import { UserProfileEntityORM } from '../entities/user-profile.entity';

export class UserProfileMapper {
  static toDomain(user: UserProfileEntityORM): UserProfileEntity {
    return UserProfileEntity.restore({
      id: user.id,
      email: Email.create(user.email),
      username: Username.create(user.username),
      firstName: user.firstName,
      lastName: user.lastName,
      displayName: user.displayName,
      avatar: user.avatar,
      locale: user.locale,
      primaryContactId: user.primaryContactId,
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
      primaryContactId: user.primaryContactId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
