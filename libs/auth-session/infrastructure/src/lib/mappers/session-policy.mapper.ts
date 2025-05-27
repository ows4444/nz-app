import { SessionPolicyEntity } from '@nz/auth-session-domain';
import { SessionPolicyEntityORM } from '../entities';

export class SessionPolicyMapper {
  static toDomain(loginAttempt: SessionPolicyEntityORM): SessionPolicyEntity {
    return SessionPolicyEntity.restore({
      policyId: loginAttempt.policyId,
      inactivityTimeout: loginAttempt.inactivityTimeout,
      maxSessions: loginAttempt.maxSessions,
      createdAt: loginAttempt.createdAt,
    });
  }

  static toPersistence(loginAttempt: SessionPolicyEntity): Partial<SessionPolicyEntityORM> {
    return {
      policyId: loginAttempt.policyId,
      inactivityTimeout: loginAttempt.inactivityTimeout,
      maxSessions: loginAttempt.maxSessions,
      createdAt: loginAttempt.createdAt,
    };
  }
}
