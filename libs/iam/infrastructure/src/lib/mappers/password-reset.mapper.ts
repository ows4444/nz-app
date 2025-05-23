import { PasswordResetEntity } from '@nz/iam-domain';
import { PasswordResetEntityORM, UserProfileEntityORM } from '../entities';

export class PasswordResetMapper {
  static toDomain(passwordReset: PasswordResetEntityORM): PasswordResetEntity {
    return PasswordResetEntity.restore({
      id: passwordReset.id,
      userId: passwordReset.user.id,
      token: passwordReset.token,
      expiresAt: passwordReset.expiresAt ?? new Date(0),
    });
  }

  static toPersistence(passwordReset: PasswordResetEntity): Partial<PasswordResetEntityORM> {
    return {
      id: passwordReset.id,
      user: { id: passwordReset.userId } as UserProfileEntityORM,
      token: passwordReset.token,
      expiresAt: passwordReset.expiresAt,
    };
  }
}
