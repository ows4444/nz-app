import { ContactVerificationEntity } from '@nz/identity-device-domain';
import { ContactVerificationEntityORM } from '../entities';

export class ContactVerificationMapper {
  static toDomain(userContact: ContactVerificationEntityORM): ContactVerificationEntity {
    return ContactVerificationEntity.restore({
      id: userContact.id,
      code: userContact.code,
      contactId: userContact.contactId,
      purpose: userContact.purpose,
      tokenHash: userContact.tokenHash,
      expiresAt: userContact.expiresAt,
      requestedAt: userContact.requestedAt,
      ipAddress: userContact.ipAddress,
      userAgent: userContact.userAgent,
      usedFlag: userContact.usedFlag,
      usedAt: userContact.usedAt,

      createdAt: userContact.createdAt,
      updatedAt: userContact.updatedAt,
    });
  }

  static toPersistence(userContact: ContactVerificationEntity): Partial<ContactVerificationEntityORM> {
    return {
      id: userContact.id,
      code: userContact.code,
      contactId: userContact.contactId,
      purpose: userContact.purpose,
      tokenHash: userContact.tokenHash,
      expiresAt: userContact.expiresAt,
      requestedAt: userContact.requestedAt,
      ipAddress: userContact.ipAddress,
      userAgent: userContact.userAgent,
      usedFlag: userContact.usedFlag,
      usedAt: userContact.usedAt,

      createdAt: userContact.createdAt,
      updatedAt: userContact.updatedAt,
    };
  }
}
