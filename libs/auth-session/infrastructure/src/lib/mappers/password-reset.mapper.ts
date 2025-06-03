import { PasswordResetEntity } from '@nz/auth-session-domain';
import { PasswordResetEntityORM } from '../entities';

export class PasswordResetMapper {
  static toDomain(passwordReset: PasswordResetEntityORM): PasswordResetEntity {
    return PasswordResetEntity.restore({
      id: passwordReset.id,
      userId: passwordReset.userId,
      tokenHash: passwordReset.tokenHash,
      tokenType: passwordReset.tokenType,
      expiresAt: passwordReset.expiresAt,
      requestedAt: passwordReset.requestedAt,
      ipAddress: passwordReset.ipAddress,
      userAgent: passwordReset.userAgent,
      usedFlag: passwordReset.usedFlag,
      usedAt: passwordReset.usedAt,
      attemptsCount: passwordReset.attemptsCount,
    });
  }

  static toPersistence(passwordReset: PasswordResetEntity): Partial<PasswordResetEntityORM> {
    return {
      id: passwordReset.id,
      userId: passwordReset.userId,
      tokenHash: passwordReset.tokenHash,
      tokenType: passwordReset.tokenType,
      expiresAt: passwordReset.expiresAt,
      requestedAt: passwordReset.requestedAt,
      ipAddress: passwordReset.ipAddress,
      userAgent: passwordReset.userAgent,
      usedFlag: passwordReset.usedFlag,
      usedAt: passwordReset.usedAt,
      attemptsCount: passwordReset.attemptsCount,
    };
  }
}
