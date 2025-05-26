import { UserPasswordHistoryEntity } from '@nz/auth-session-domain';
import { UserPasswordHistoryEntityORM } from '../entities';

export class UserPasswordHistoryMapper {
  static toDomain(UserPasswordHistory: UserPasswordHistoryEntityORM): UserPasswordHistoryEntity {
    return UserPasswordHistoryEntity.restore({
      id: UserPasswordHistory.id,
      userId: UserPasswordHistory.userId,
      algo: UserPasswordHistory.algo,
      passwordHash: UserPasswordHistory.passwordHash,
      pepperVersion: UserPasswordHistory.pepperVersion,
      salt: UserPasswordHistory.salt,
      createdAt: UserPasswordHistory.createdAt,
    });
  }

  static toPersistence(UserPasswordHistory: UserPasswordHistoryEntity): Partial<UserPasswordHistoryEntityORM> {
    return {
      id: UserPasswordHistory.id,
      userId: UserPasswordHistory.userId,
      algo: UserPasswordHistory.algo,
      passwordHash: UserPasswordHistory.passwordHash,
      pepperVersion: UserPasswordHistory.pepperVersion,
      salt: UserPasswordHistory.salt,
      createdAt: UserPasswordHistory.createdAt,
    };
  }
}
