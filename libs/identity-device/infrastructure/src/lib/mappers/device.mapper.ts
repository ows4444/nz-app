import { DeviceEntity } from '@nz/identity-device-domain';
import { DeviceEntityORM } from '../entities';

export class DeviceMapper {
  static toDomain(userContact: DeviceEntityORM): DeviceEntity {
    return DeviceEntity.restore({
      id: userContact.id,
      deviceId: userContact.deviceId,
      deviceInfo: userContact.deviceInfo,
      lastSeenAt: userContact.lastSeenAt,
      status: userContact.status,
      trustScore: userContact.trustScore,

      createdAt: userContact.createdAt,
      updatedAt: userContact.updatedAt,
    });
  }

  static toPersistence(userContact: DeviceEntity): Partial<DeviceEntityORM> {
    return {
      id: userContact.id,
      deviceId: userContact.deviceId,
      deviceInfo: userContact.deviceInfo,
      lastSeenAt: userContact.lastSeenAt,
      status: userContact.status,
      trustScore: userContact.trustScore,

      createdAt: userContact.createdAt,
      updatedAt: userContact.updatedAt,
    };
  }
}
