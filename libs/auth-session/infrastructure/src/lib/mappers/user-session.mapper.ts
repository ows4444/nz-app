import { UserSessionEntity } from '@nz/auth-session-domain';
import { UserSessionEntityORM } from '../entities';

export class UserSessionMapper {
  static toDomain(loginAttempt: UserSessionEntityORM): UserSessionEntity {
    return UserSessionEntity.restore({
      id: loginAttempt.id,
      userId: loginAttempt.userId,
      tenantId: loginAttempt.tenantId,
      deviceFingerprint: loginAttempt.deviceFingerprint,
      sessionTokenHash: loginAttempt.sessionTokenHash,
      ipAddress: loginAttempt.ipAddress,
      userAgent: loginAttempt.userAgent,
      startedAt: loginAttempt.startedAt,
      lastActivityAt: loginAttempt.lastActivityAt,
      expiresAt: loginAttempt.expiresAt,
      terminatedAt: loginAttempt.terminatedAt,
      terminationReason: loginAttempt.terminationReason,
      isActive: loginAttempt.isActive,
    });
  }

  static toPersistence(loginAttempt: UserSessionEntity): Partial<UserSessionEntityORM> {
    return {
      id: loginAttempt.id,
      userId: loginAttempt.userId,
      tenantId: loginAttempt.tenantId,
      deviceFingerprint: loginAttempt.deviceFingerprint,
      sessionTokenHash: loginAttempt.sessionTokenHash,
      ipAddress: loginAttempt.ipAddress,
      userAgent: loginAttempt.userAgent,
      startedAt: loginAttempt.startedAt,
      lastActivityAt: loginAttempt.lastActivityAt,
      expiresAt: loginAttempt.expiresAt,
      terminatedAt: loginAttempt.terminatedAt,
      terminationReason: loginAttempt.terminationReason,
      isActive: loginAttempt.isActive,
    };
  }
}
