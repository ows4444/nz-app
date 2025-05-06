import { AggregateRoot } from '@nestjs/cqrs';
import { UserAccountEntity } from '../entities/user-account.entity';

export class UserAccountAggregate extends AggregateRoot {
  public id: string;
  constructor(private user: UserAccountEntity) {
    super();
    this.id = this.user.id;
  }
}
