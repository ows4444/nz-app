import { LoginAttemptEntity } from '@nz/auth-session-domain';
import { LoginAttemptEntityORM } from '../entities';

export class LoginAttemptMapper {
  static toDomain(loginAttempt: LoginAttemptEntityORM): LoginAttemptEntity {
    return LoginAttemptEntity.restore({
      id: loginAttempt.id,
      userId: loginAttempt.userId,
      ipAddress: loginAttempt.ipAddress,
      userAgent: loginAttempt.userAgent,
      riskScore: loginAttempt.riskScore,
      successFlag: loginAttempt.successFlag,
      timestamp: loginAttempt.createdAt,
    });
  }

  static toPersistence(loginAttempt: LoginAttemptEntity): Partial<LoginAttemptEntityORM> {
    return {
      id: loginAttempt.id,
      userId: loginAttempt.userId,
      ipAddress: loginAttempt.ipAddress,
      userAgent: loginAttempt.userAgent,
      riskScore: loginAttempt.riskScore,
      successFlag: loginAttempt.successFlag,
      createdAt: loginAttempt.timestamp,
    };
  }
}
