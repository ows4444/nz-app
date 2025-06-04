import { ContactVerificationEntity } from '@nz/identity-device-domain';
import { ContactVerificationEntityORM } from '../entities';

export class ContactVerificationMapper {
  static toDomain(userContact: ContactVerificationEntityORM): ContactVerificationEntity {
    return ContactVerificationEntity.restore({
      id: userContact.id,
      contactId: userContact.contactId,
      purpose: userContact.purpose,
      tokenHash: userContact.tokenHash,
      code: userContact.code,
      deliveryMethod: userContact.deliveryMethod,
      expiresAt: userContact.expiresAt,
      maxAttempts: userContact.maxAttempts,
      requestedAt: userContact.requestedAt,
      ipAddress: userContact.ipAddress,
      userAgent: userContact.userAgent,
      usedFlag: userContact.usedFlag,
      usedAt: userContact.usedAt,
      attemptsCount: userContact.attemptsCount,
    });
  }

  static toPersistence(userContact: ContactVerificationEntity): Partial<ContactVerificationEntityORM> {
    return {
      id: userContact.id,
      contactId: userContact.contactId,
      purpose: userContact.purpose,
      tokenHash: userContact.tokenHash,
      code: userContact.code,
      deliveryMethod: userContact.deliveryMethod,
      expiresAt: userContact.expiresAt,
      maxAttempts: userContact.maxAttempts,
      requestedAt: userContact.requestedAt,
      ipAddress: userContact.ipAddress,
      userAgent: userContact.userAgent,
      usedFlag: userContact.usedFlag,
      usedAt: userContact.usedAt,
      attemptsCount: userContact.attemptsCount,
    };
  }
}
