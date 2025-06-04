import { DeviceSessionEntity } from '@nz/identity-device-domain';
import { DeviceSessionEntityORM } from '../entities';

export class DeviceSessionMapper {
  static toDomain(userContact: DeviceSessionEntityORM): DeviceSessionEntity {
    return DeviceSessionEntity.restore({
      id: userContact.id,
      deviceId: userContact.deviceId,
      userId: userContact.userId,
      tenantId: userContact.tenantId,
      activeFlag: userContact.activeFlag,
      ipAddress: userContact.ipAddress,
      startedAt: userContact.startedAt,
      lastSeenAt: userContact.lastSeenAt,
      geoLocation: userContact.geoLocation,
      city: userContact.city,
      country: userContact.country,
      sessionDurationMinutes: userContact.sessionDurationMinutes,
    });
  }

  static toPersistence(userContact: DeviceSessionEntity): Partial<DeviceSessionEntityORM> {
    return {
      id: userContact.id,
      deviceId: userContact.deviceId,
      userId: userContact.userId,
      tenantId: userContact.tenantId,
      activeFlag: userContact.activeFlag,
      ipAddress: userContact.ipAddress,
      startedAt: userContact.startedAt,
      lastSeenAt: userContact.lastSeenAt,
      geoLocation: userContact.geoLocation,
      city: userContact.city,
      country: userContact.country,
      sessionDurationMinutes: userContact.sessionDurationMinutes,
    };
  }
}
