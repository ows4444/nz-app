import { UserCredentialEntity } from '@nz/iam-domain';
import { UserCredentialEntityORM } from '../entities';

export class UserCredentialMapper {
  static toDomain(user: UserCredentialEntityORM): UserCredentialEntity {
    return UserCredentialEntity.restore({
      id: user.id,
      algo: user.algo,
      passwordHash: user.passwordHash,
      pepperVersion: user.pepperVersion,
      salt: user.salt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }

  static toPersistence(userCredential: UserCredentialEntity): Partial<UserCredentialEntityORM> {
    return {
      id: userCredential.id,
      algo: userCredential.algo,
      passwordHash: userCredential.passwordHash,
      pepperVersion: userCredential.pepperVersion,
      salt: userCredential.salt,
      createdAt: userCredential.createdAt,
      updatedAt: userCredential.updatedAt,
    };
  }
}
