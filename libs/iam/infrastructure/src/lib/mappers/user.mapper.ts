import { Email, UserEntity, Username } from '@nz/iam-domain';
import { UserEntityORM } from '../entities/user.entity';

export class UserMapper {
  static toDomain(user: UserEntityORM): UserEntity {
    return UserEntity.restore({
      id: user.id,
      email: Email.create(user.email),
      username: Username.create(user.username),
      primaryContactId: user.primary_contact_id,

      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }

  static toPersistence(user: UserEntity): Partial<UserEntityORM> {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      primary_contact_id: user.primaryContactId,

      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
