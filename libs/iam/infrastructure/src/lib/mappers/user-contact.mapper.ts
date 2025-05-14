import { UserContactEntity } from '@nz/iam-domain';
import { UserEntityORM } from '../entities';
import { UserContactEntityORM } from '../entities/user-contact.entity';

export class UserContactMapper {
  static toDomain(userContact: UserContactEntityORM): UserContactEntity {
    return UserContactEntity.restore({
      id: userContact.id,
      userId: userContact.user.id,
      type: userContact.type,
      value: userContact.value,
      isVerified: userContact.isVerified,

      createdAt: userContact.createdAt,
      updatedAt: userContact.updatedAt,
    });
  }

  static toPersistence(userContact: UserContactEntity): Partial<UserContactEntityORM> {
    return {
      id: userContact.id,
      user: { id: userContact.userId } as unknown as UserEntityORM,
      type: userContact.type,
      value: userContact.value,
      isVerified: userContact.isVerified,

      createdAt: userContact.createdAt,
      updatedAt: userContact.updatedAt,
    };
  }
}
