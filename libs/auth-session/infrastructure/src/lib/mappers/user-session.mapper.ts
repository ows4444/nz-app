import { UserSessionEntity } from '@nz/auth-session-domain';
import { UserSessionEntityORM } from '../entities';

export class UserSessionMapper {
  static toDomain(userSession: UserSessionEntityORM): UserSessionEntity {
    return UserSessionEntity.restore({
      id: userSession.id,
      userId: userSession.userId,
      tenantId: userSession.tenantId,
      deviceFingerprint: userSession.deviceFingerprint,
      sessionTokenHash: userSession.sessionTokenHash,
      ipAddress: userSession.ipAddress,
      userAgent: userSession.userAgent,
      startedAt: userSession.startedAt,
      lastActivityAt: userSession.lastActivityAt,
      expiresAt: userSession.expiresAt,
      terminatedAt: userSession.terminatedAt,
      terminationReason: userSession.terminationReason,
      isActive: userSession.isActive,
    });
  }

  static toPersistence(userSession: UserSessionEntity): Partial<UserSessionEntityORM> {
    return {
      id: userSession.id,
      userId: userSession.userId,
      tenantId: userSession.tenantId,
      deviceFingerprint: userSession.deviceFingerprint,
      sessionTokenHash: userSession.sessionTokenHash,
      ipAddress: userSession.ipAddress,
      userAgent: userSession.userAgent,
      startedAt: userSession.startedAt,
      lastActivityAt: userSession.lastActivityAt,
      expiresAt: userSession.expiresAt,
      terminatedAt: userSession.terminatedAt,
      terminationReason: userSession.terminationReason,
      isActive: userSession.isActive,
    };
  }
}
