import { SessionPolicyEntity } from '@nz/auth-session-domain';
import { SessionPolicyEntityORM } from '../entities';

export class SessionPolicyMapper {
  static toDomain(sessionPolicy: SessionPolicyEntityORM): SessionPolicyEntity {
    return SessionPolicyEntity.restore({
      id: sessionPolicy.id,
      tenantId: sessionPolicy.tenantId,
      maxConcurrentSessions: sessionPolicy.maxConcurrentSessions,
      inactivityTimeoutMinutes: sessionPolicy.inactivityTimeoutMinutes,
      absoluteTimeoutHours: sessionPolicy.absoluteTimeoutHours,
      requireMFA: sessionPolicy.requireMFA,
      allowedIpRanges: sessionPolicy.allowedIpRanges,
      deviceTrustRequired: sessionPolicy.deviceTrustRequired,
      createdAt: sessionPolicy.createdAt,
      updatedAt: sessionPolicy.updatedAt,
    });
  }

  static toPersistence(sessionPolicy: SessionPolicyEntity): Partial<SessionPolicyEntityORM> {
    return {
      id: sessionPolicy.id,
      tenantId: sessionPolicy.tenantId,
      maxConcurrentSessions: sessionPolicy.maxConcurrentSessions,
      inactivityTimeoutMinutes: sessionPolicy.inactivityTimeoutMinutes,
      absoluteTimeoutHours: sessionPolicy.absoluteTimeoutHours,
      requireMFA: sessionPolicy.requireMFA,
      allowedIpRanges: sessionPolicy.allowedIpRanges,
      deviceTrustRequired: sessionPolicy.deviceTrustRequired,
      createdAt: sessionPolicy.createdAt,
      updatedAt: sessionPolicy.updatedAt,
    };
  }
}
