import { LoginAttemptEntity } from '@nz/iam-domain';
import { LoginAttemptEntityORM, UserProfileEntityORM } from '../entities';

export class LoginAttemptMapper {
  static toDomain(loginAttempt: LoginAttemptEntityORM): LoginAttemptEntity {
    return LoginAttemptEntity.restore({
      id: loginAttempt.id,
      ipAddress: loginAttempt.ipAddress,
      userAgent: loginAttempt.userAgent,
      riskScore: loginAttempt.riskScore,
      successFlag: loginAttempt.successFlag,
      timestamp: loginAttempt.createdAt,
      userId: loginAttempt.user.id,
    });
  }

  static toPersistence(loginAttempt: LoginAttemptEntity): Partial<LoginAttemptEntityORM> {
    return {
      id: loginAttempt.id,
      user: { id: loginAttempt.userId } as UserProfileEntityORM,
      ipAddress: loginAttempt.ipAddress,
      userAgent: loginAttempt.userAgent,
      riskScore: loginAttempt.riskScore,
      successFlag: loginAttempt.successFlag,
      createdAt: loginAttempt.timestamp,
    };
  }
}
