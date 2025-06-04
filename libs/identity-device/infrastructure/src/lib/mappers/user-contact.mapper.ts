import { UserContactEntity } from '@nz/identity-device-domain';
import { UserContactEntityORM } from '../entities';

export class UserContactMapper {
  static toDomain(userContact: UserContactEntityORM): UserContactEntity {
    return UserContactEntity.restore({
      id: userContact.id,
      userId: userContact.userId,
      tenantId: userContact.tenantId,
      type: userContact.type,
      label: userContact.label,
      value: userContact.value,
      verifiedFlag: userContact.verifiedFlag,
      verifiedAt: userContact.verifiedAt,
      isPrimary: userContact.isPrimary,
      countryCode: userContact.countryCode,
      createdAt: userContact.createdAt,
      updatedAt: userContact.updatedAt,
    });
  }

  static toPersistence(userContact: UserContactEntity): Partial<UserContactEntityORM> {
    return {
      id: userContact.id,
      userId: userContact.userId,
      tenantId: userContact.tenantId,
      type: userContact.type,
      label: userContact.label,
      value: userContact.value,
      verifiedFlag: userContact.verifiedFlag,
      verifiedAt: userContact.verifiedAt,
      isPrimary: userContact.isPrimary,
      countryCode: userContact.countryCode,
      createdAt: userContact.createdAt,
      updatedAt: userContact.updatedAt,
    };
  }
}
