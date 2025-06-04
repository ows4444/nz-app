import { ContactVerificationEntity } from '@nz/identity-device-domain';
import { ContactVerificationEntityORM } from '../entities';

export class ContactVerificationMapper {
  static toDomain(contactVerification: ContactVerificationEntityORM): ContactVerificationEntity {
    return ContactVerificationEntity.restore({
      id: contactVerification.id,
      contactId: contactVerification.contactId,
      purpose: contactVerification.purpose,
      tokenHash: contactVerification.tokenHash,
      code: contactVerification.code,
      deliveryMethod: contactVerification.deliveryMethod,
      expiresAt: contactVerification.expiresAt,
      maxAttempts: contactVerification.maxAttempts,
      requestedAt: contactVerification.requestedAt,
      ipAddress: contactVerification.ipAddress,
      userAgent: contactVerification.userAgent,
      usedFlag: contactVerification.usedFlag,
      usedAt: contactVerification.usedAt,
      attemptsCount: contactVerification.attemptsCount,
    });
  }

  static toPersistence(contactVerification: ContactVerificationEntity): Partial<ContactVerificationEntityORM> {
    return {
      id: contactVerification.id,
      contactId: contactVerification.contactId,
      purpose: contactVerification.purpose,
      tokenHash: contactVerification.tokenHash,
      code: contactVerification.code,
      deliveryMethod: contactVerification.deliveryMethod,
      expiresAt: contactVerification.expiresAt,
      maxAttempts: contactVerification.maxAttempts,
      requestedAt: contactVerification.requestedAt,
      ipAddress: contactVerification.ipAddress,
      userAgent: contactVerification.userAgent,
      usedFlag: contactVerification.usedFlag,
      usedAt: contactVerification.usedAt,
      attemptsCount: contactVerification.attemptsCount,
    };
  }
}
