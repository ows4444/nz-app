import { DeviceEntity } from '@nz/identity-device-domain';
import { DeviceEntityORM } from '../entities';

export class DeviceMapper {
  static toDomain(device: DeviceEntityORM): DeviceEntity {
    return DeviceEntity.restore({
      id: device.id,
      deviceFingerprint: device.deviceFingerprint,
      deviceName: device.deviceName,
      deviceType: device.deviceType,
      osName: device.osName,
      osVersion: device.osVersion,
      browserName: device.browserName,
      browserVersion: device.browserVersion,
      deviceInfo: device.deviceInfo,
      status: device.status,
      trustScore: device.trustScore,
      riskLevel: device.riskLevel,
      isTrusted: device.isTrusted,
      firstSeenAt: device.firstSeenAt,
      lastSeenAt: device.lastSeenAt,
      createdAt: device.createdAt,
      updatedAt: device.updatedAt,
    });
  }

  static toPersistence(device: DeviceEntity): Partial<DeviceEntityORM> {
    return {
      id: device.id,
      deviceFingerprint: device.deviceFingerprint,
      deviceName: device.deviceName,
      deviceType: device.deviceType,
      osName: device.osName,
      osVersion: device.osVersion,
      browserName: device.browserName,
      browserVersion: device.browserVersion,
      deviceInfo: device.deviceInfo,
      status: device.status,
      trustScore: device.trustScore,
      riskLevel: device.riskLevel,
      isTrusted: device.isTrusted,
      firstSeenAt: device.firstSeenAt,
      lastSeenAt: device.lastSeenAt,
      createdAt: device.createdAt,
      updatedAt: device.updatedAt,
    };
  }
}
