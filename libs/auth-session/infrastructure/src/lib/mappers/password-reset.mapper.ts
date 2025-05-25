import { PasswordResetEntity } from '@nz/auth-session-domain';
import { PasswordResetEntityORM } from '../entities';

export class PasswordResetMapper {
  static toDomain(passwordReset: PasswordResetEntityORM): PasswordResetEntity {
    return PasswordResetEntity.restore({
      id: passwordReset.id,
      userId: passwordReset.userId,
      token: passwordReset.token,
      expiresAt: passwordReset.expiresAt ?? new Date(0),
    });
  }

  static toPersistence(passwordReset: PasswordResetEntity): Partial<PasswordResetEntityORM> {
    return {
      id: passwordReset.id,
      userId: passwordReset.userId,
      token: passwordReset.token,
      expiresAt: passwordReset.expiresAt,
    };
  }
}
