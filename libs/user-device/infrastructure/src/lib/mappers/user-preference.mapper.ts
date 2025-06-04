import { UserPreferenceEntity } from '@nz/user-device-domain';
import { UserPreferenceEntityORM } from '../entities';

export class UserPreferenceMapper {
  static toDomain(userPreference: UserPreferenceEntityORM): UserPreferenceEntity {
    return UserPreferenceEntity.restore({
      id: userPreference.id,
      userId: userPreference.userId,
      tenantId: userPreference.tenantId,
      category: userPreference.category,
      preferenceKey: userPreference.preferenceKey,
      preferenceValue: userPreference.preferenceValue,
      dataType: userPreference.dataType,
      isEncrypted: userPreference.isEncrypted,
      updatedAt: userPreference.updatedAt,
    });
  }

  static toPersistence(userPreference: UserPreferenceEntity): Partial<UserPreferenceEntityORM> {
    return {
      id: userPreference.id,
      userId: userPreference.userId,
      tenantId: userPreference.tenantId,
      category: userPreference.category,
      preferenceKey: userPreference.preferenceKey,
      preferenceValue: userPreference.preferenceValue,
      dataType: userPreference.dataType,
      isEncrypted: userPreference.isEncrypted,
      updatedAt: userPreference.updatedAt,
    };
  }
}
