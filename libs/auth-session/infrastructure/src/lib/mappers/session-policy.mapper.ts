import { SessionPolicyEntity } from '@nz/auth-session-domain';
import { SessionPolicyEntityORM } from '../entities';

export class SessionPolicyMapper {
  static toDomain(loginAttempt: SessionPolicyEntityORM): SessionPolicyEntity {
    return SessionPolicyEntity.restore({
      id: loginAttempt.id,
      tenantId: loginAttempt.tenantId,
      maxConcurrentSessions: loginAttempt.maxConcurrentSessions,
      inactivityTimeoutMinutes: loginAttempt.inactivityTimeoutMinutes,
      absoluteTimeoutHours: loginAttempt.absoluteTimeoutHours,
      requireMFA: loginAttempt.requireMFA,
      allowedIpRanges: loginAttempt.allowedIpRanges,
      deviceTrustRequired: loginAttempt.deviceTrustRequired,
      createdAt: loginAttempt.createdAt,
      updatedAt: loginAttempt.updatedAt,
    });
  }

  static toPersistence(loginAttempt: SessionPolicyEntity): Partial<SessionPolicyEntityORM> {
    return {
      id: loginAttempt.id,
      tenantId: loginAttempt.tenantId,
      maxConcurrentSessions: loginAttempt.maxConcurrentSessions,
      inactivityTimeoutMinutes: loginAttempt.inactivityTimeoutMinutes,
      absoluteTimeoutHours: loginAttempt.absoluteTimeoutHours,
      requireMFA: loginAttempt.requireMFA,
      allowedIpRanges: loginAttempt.allowedIpRanges,
      deviceTrustRequired: loginAttempt.deviceTrustRequired,
      createdAt: loginAttempt.createdAt,
      updatedAt: loginAttempt.updatedAt,
    };
  }
}
