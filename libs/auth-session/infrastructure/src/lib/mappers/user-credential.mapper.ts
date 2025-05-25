import { UserCredentialEntity } from '@nz/auth-session-domain';
import { UserCredentialEntityORM } from '../entities';

export class UserCredentialMapper {
  static toDomain(userCredential: UserCredentialEntityORM): UserCredentialEntity {
    return UserCredentialEntity.restore({
      userId: userCredential.userId,
      algo: userCredential.algo,
      passwordHash: userCredential.passwordHash,
      pepperVersion: userCredential.pepperVersion,
      salt: userCredential.salt,
      createdAt: userCredential.createdAt,
      updatedAt: userCredential.updatedAt,
    });
  }

  static toPersistence(userCredential: UserCredentialEntity): Partial<UserCredentialEntityORM> {
    return {
      userId: userCredential.userId,
      algo: userCredential.algo,
      passwordHash: userCredential.passwordHash,
      pepperVersion: userCredential.pepperVersion,
      salt: userCredential.salt,
      createdAt: userCredential.createdAt,
      updatedAt: userCredential.updatedAt,
    };
  }
}
