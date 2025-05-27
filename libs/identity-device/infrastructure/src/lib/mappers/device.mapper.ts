import { DeviceEntity } from '@nz/identity-device-domain';
import { DeviceEntityORM } from '../entities';

export class DeviceMapper {
  static toDomain(userContact: DeviceEntityORM): DeviceEntity {
    return DeviceEntity.restore({
      deviceInfo: userContact.deviceInfo,
      deviceId: userContact.deviceId,
      userId: userContact.userId,
      lastSeenAt: userContact.lastSeenAt,
      status: userContact.status,
      trustScore: userContact.trustScore,

      createdAt: userContact.createdAt,
      updatedAt: userContact.updatedAt,
    });
  }

  static toPersistence(userContact: DeviceEntity): Partial<DeviceEntityORM> {
    return {
      deviceInfo: userContact.deviceInfo,
      deviceId: userContact.deviceId,
      userId: userContact.userId,
      lastSeenAt: userContact.lastSeenAt,
      status: userContact.status,
      trustScore: userContact.trustScore,

      createdAt: userContact.createdAt,
      updatedAt: userContact.updatedAt,
    };
  }
}
