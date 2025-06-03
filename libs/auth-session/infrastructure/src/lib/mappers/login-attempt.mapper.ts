import { LoginAttemptEntity } from '@nz/auth-session-domain';
import { LoginAttemptEntityORM } from '../entities';

export class LoginAttemptMapper {
  static toDomain(loginAttempt: LoginAttemptEntityORM): LoginAttemptEntity {
    return LoginAttemptEntity.restore({
      id: loginAttempt.id,
      userId: loginAttempt.userId,
      tenantId: loginAttempt.tenantId,
      emailAttempted: loginAttempt.emailAttempted,
      timestamp: loginAttempt.timestamp,
      successFlag: loginAttempt.successFlag,
      failureReason: loginAttempt.failureReason,
      ipAddress: loginAttempt.ipAddress,
      userAgent: loginAttempt.userAgent,
      riskScore: loginAttempt.riskScore,
      locationData: loginAttempt.locationData,
      deviceFingerprint: loginAttempt.deviceFingerprint,
    });
  }

  static toPersistence(loginAttempt: LoginAttemptEntity): Partial<LoginAttemptEntityORM> {
    return {
      id: loginAttempt.id,
      userId: loginAttempt.userId,
      tenantId: loginAttempt.tenantId,
      emailAttempted: loginAttempt.emailAttempted,
      timestamp: loginAttempt.timestamp,
      successFlag: loginAttempt.successFlag,
      failureReason: loginAttempt.failureReason,
      ipAddress: loginAttempt.ipAddress,
      userAgent: loginAttempt.userAgent,
      riskScore: loginAttempt.riskScore,
      locationData: loginAttempt.locationData,
      deviceFingerprint: loginAttempt.deviceFingerprint,
    };
  }
}
