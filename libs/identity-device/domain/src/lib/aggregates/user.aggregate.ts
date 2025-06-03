import { AggregateRoot } from '@nestjs/cqrs';
import { UserProfileEntity } from '../entities/user-profile.entity';
import { AssignDeviceToUserEvent, CreateUserCredentialEvent } from '../events';

export class UserAggregate extends AggregateRoot {
  private readonly userProfileEntity: UserProfileEntity;

  constructor(userEntity: UserProfileEntity) {
    super();
    this.userProfileEntity = userEntity;
  }

  get id(): string {
    return this.userProfileEntity.id;
  }

  createUserCredential(password: string, lang: string) {
    this.apply(new CreateUserCredentialEvent(this.id, password, lang));
  }

  assignDevice(deviceId: string, deviceInfo: string) {
    this.apply(new AssignDeviceToUserEvent(this.id, deviceId, deviceInfo));
  }
}
