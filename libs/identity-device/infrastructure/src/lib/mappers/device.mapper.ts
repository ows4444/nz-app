import { DeviceEntity } from '@nz/identity-device-domain';
import { DeviceEntityORM } from '../entities';

export class DeviceMapper {
  static toDomain(userContact: DeviceEntityORM): DeviceEntity {
    return DeviceEntity.restore({
      id: userContact.id,
      deviceFingerprint: userContact.deviceFingerprint,
      deviceName: userContact.deviceName,
      deviceType: userContact.deviceType,
      osName: userContact.osName,
      osVersion: userContact.osVersion,
      browserName: userContact.browserName,
      browserVersion: userContact.browserVersion,
      deviceInfo: userContact.deviceInfo,
      status: userContact.status,
      trustScore: userContact.trustScore,
      riskLevel: userContact.riskLevel,
      isTrusted: userContact.isTrusted,
      firstSeenAt: userContact.firstSeenAt,
      lastSeenAt: userContact.lastSeenAt,
      createdAt: userContact.createdAt,
      updatedAt: userContact.updatedAt,
    });
  }

  static toPersistence(userContact: DeviceEntity): Partial<DeviceEntityORM> {
    return {
      id: userContact.id,
      deviceFingerprint: userContact.deviceFingerprint,
      deviceName: userContact.deviceName,
      deviceType: userContact.deviceType,
      osName: userContact.osName,
      osVersion: userContact.osVersion,
      browserName: userContact.browserName,
      browserVersion: userContact.browserVersion,
      deviceInfo: userContact.deviceInfo,
      status: userContact.status,
      trustScore: userContact.trustScore,
      riskLevel: userContact.riskLevel,
      isTrusted: userContact.isTrusted,
      firstSeenAt: userContact.firstSeenAt,
      lastSeenAt: userContact.lastSeenAt,
      createdAt: userContact.createdAt,
      updatedAt: userContact.updatedAt,
    };
  }
}
