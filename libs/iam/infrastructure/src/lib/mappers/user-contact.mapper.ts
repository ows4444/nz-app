import { UserContactEntity } from '@nz/iam-domain';
import { UserContactEntityORM, UserProfileEntityORM } from '../entities';

export class UserContactMapper {
  static toDomain(userContact: UserContactEntityORM): UserContactEntity {
    return UserContactEntity.restore({
      id: userContact.id,
      userId: userContact.user.id,
      type: userContact.type,
      value: userContact.value,
      isVerified: userContact.isVerified,
      isDefault: userContact.isDefault,

      createdAt: userContact.createdAt,
      updatedAt: userContact.updatedAt,
    });
  }

  static toPersistence(userContact: UserContactEntity): Partial<UserContactEntityORM> {
    return {
      id: userContact.id,
      user: { id: userContact.userId } as UserProfileEntityORM,
      type: userContact.type,
      value: userContact.value,
      isVerified: userContact.isVerified,
      isDefault: userContact.isDefault,

      createdAt: userContact.createdAt,
      updatedAt: userContact.updatedAt,
    };
  }
}
