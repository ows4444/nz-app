import { DeviceSessionEntity } from '@nz/user-device-domain';
import { DeviceSessionEntityORM } from '../entities';

export class DeviceSessionMapper {
  static toDomain(deviceSession: DeviceSessionEntityORM): DeviceSessionEntity {
    return DeviceSessionEntity.restore({
      id: deviceSession.id,
      deviceId: deviceSession.deviceId,
      userId: deviceSession.userId,
      tenantId: deviceSession.tenantId,
      activeFlag: deviceSession.activeFlag,
      ipAddress: deviceSession.ipAddress,
      startedAt: deviceSession.startedAt,
      lastSeenAt: deviceSession.lastSeenAt,
      geoLocation: deviceSession.geoLocation,
      city: deviceSession.city,
      country: deviceSession.country,
      sessionDurationMinutes: deviceSession.sessionDurationMinutes,
    });
  }

  static toPersistence(deviceSession: DeviceSessionEntity): Partial<DeviceSessionEntityORM> {
    return {
      id: deviceSession.id,
      deviceId: deviceSession.deviceId,
      userId: deviceSession.userId,
      tenantId: deviceSession.tenantId,
      activeFlag: deviceSession.activeFlag,
      ipAddress: deviceSession.ipAddress,
      startedAt: deviceSession.startedAt,
      lastSeenAt: deviceSession.lastSeenAt,
      geoLocation: deviceSession.geoLocation,
      city: deviceSession.city,
      country: deviceSession.country,
      sessionDurationMinutes: deviceSession.sessionDurationMinutes,
    };
  }
}
