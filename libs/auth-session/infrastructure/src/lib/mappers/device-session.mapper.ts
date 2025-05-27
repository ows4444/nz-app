import { DeviceSessionEntity } from '@nz/auth-session-domain';
import { DeviceSessionEntityORM } from '../entities';

export class DeviceSessionMapper {
  static toDomain(loginAttempt: DeviceSessionEntityORM): DeviceSessionEntity {
    return DeviceSessionEntity.restore({
      activeFlag: loginAttempt.activeFlag,
      deviceId: loginAttempt.deviceId,
      geoLocation: loginAttempt.geoLocation,
      ipAddress: loginAttempt.ipAddress,
      userId: loginAttempt.userId,
      sessionId: loginAttempt.sessionId,
      startedAt: loginAttempt.startedAt,
      lastSeenAt: loginAttempt.lastSeenAt,
    });
  }

  static toPersistence(loginAttempt: DeviceSessionEntity): Partial<DeviceSessionEntityORM> {
    return {
      activeFlag: loginAttempt.activeFlag,
      deviceId: loginAttempt.deviceId,
      geoLocation: loginAttempt.geoLocation,
      ipAddress: loginAttempt.ipAddress,
      userId: loginAttempt.userId,
      sessionId: loginAttempt.sessionId,
      startedAt: loginAttempt.startedAt,
      lastSeenAt: loginAttempt.lastSeenAt,
    };
  }
}
