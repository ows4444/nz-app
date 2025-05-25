import { AggregateRoot } from '@nestjs/cqrs';
import { UserProfileEntity } from '../entities/user-profile.entity';

export class UserAggregate extends AggregateRoot {
  public id: string;
  constructor(private user: UserProfileEntity) {
    super();
    this.id = this.user.id;
  }
}
