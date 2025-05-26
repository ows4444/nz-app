import { UserPreferenceEntity } from '@nz/identity-device-domain';
import { UserPreferenceEntityORM } from '../entities';

export class UserPreferenceMapper {
  static toDomain(UserPreference: UserPreferenceEntityORM): UserPreferenceEntity {
    return UserPreferenceEntity.restore({
      userId: UserPreference.userId,
      key: UserPreference.key,

      value: UserPreference.value,
      source: UserPreference.source,

      createdAt: UserPreference.createdAt,
      updatedAt: UserPreference.updatedAt,
    });
  }

  static toPersistence(UserPreference: UserPreferenceEntity): Partial<UserPreferenceEntityORM> {
    return {
      userId: UserPreference.userId,
      key: UserPreference.key,

      value: UserPreference.value,
      source: UserPreference.source,

      createdAt: UserPreference.createdAt,
      updatedAt: UserPreference.updatedAt,
    };
  }
}
