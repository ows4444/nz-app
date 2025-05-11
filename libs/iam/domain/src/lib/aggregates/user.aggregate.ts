import { AggregateRoot } from '@nestjs/cqrs';
import { UserEntity } from '../entities/user.entity';

export class UserAggregate extends AggregateRoot {
  public id: string;
  constructor(private user: UserEntity) {
    super();
    this.id = this.user.id;
  }
}
