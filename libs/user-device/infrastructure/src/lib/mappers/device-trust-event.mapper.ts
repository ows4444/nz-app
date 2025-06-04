import { DeviceTrustEventEntity } from '@nz/user-device-domain';
import { DeviceTrustEventEntityORM } from '../entities';

export class DeviceTrustEventMapper {
  static toDomain(deviceTrustEvent: DeviceTrustEventEntityORM): DeviceTrustEventEntity {
    return DeviceTrustEventEntity.restore({
      id: deviceTrustEvent.id,
      deviceId: deviceTrustEvent.deviceId,
      userId: deviceTrustEvent.userId,
      tenantId: deviceTrustEvent.tenantId,
      eventType: deviceTrustEvent.eventType,
      reason: deviceTrustEvent.reason,
      createdBy: deviceTrustEvent.createdBy,
      metadataJson: deviceTrustEvent.metadataJson,
      createdAt: deviceTrustEvent.createdAt,
    });
  }

  static toPersistence(deviceTrustEvent: DeviceTrustEventEntity): Partial<DeviceTrustEventEntityORM> {
    return {
      id: deviceTrustEvent.id,
      deviceId: deviceTrustEvent.deviceId,
      userId: deviceTrustEvent.userId,
      tenantId: deviceTrustEvent.tenantId,
      eventType: deviceTrustEvent.eventType,
      reason: deviceTrustEvent.reason,
      createdBy: deviceTrustEvent.createdBy,
      metadataJson: deviceTrustEvent.metadataJson,
    };
  }
}
