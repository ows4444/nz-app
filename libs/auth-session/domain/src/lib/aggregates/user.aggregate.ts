import { AggregateRoot } from '@nestjs/cqrs';
import { UserEntity } from '../entities/user.entity';

export class UserAggregate extends AggregateRoot {
  private readonly userEntity: UserEntity;

  constructor(userEntity: UserEntity) {
    super();
    this.userEntity = userEntity;
  }

  get id(): string {
    return this.userEntity.id;
  }
}
