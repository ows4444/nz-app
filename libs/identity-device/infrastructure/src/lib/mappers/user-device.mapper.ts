import { UserDeviceEntity } from '@nz/identity-device-domain';
import { UserDeviceEntityORM } from '../entities';

export class UserDeviceMapper {
  static toDomain(userContact: UserDeviceEntityORM): UserDeviceEntity {
    return UserDeviceEntity.restore({
      deviceId: userContact.deviceId,
      userId: userContact.userId,
      status: userContact.status,
      linkedAt: userContact.linkedAt,
    });
  }

  static toPersistence(userContact: UserDeviceEntity): Partial<UserDeviceEntityORM> {
    return {
      deviceId: userContact.deviceId,
      userId: userContact.userId,
      status: userContact.status,
      linkedAt: userContact.linkedAt,
    };
  }
}
