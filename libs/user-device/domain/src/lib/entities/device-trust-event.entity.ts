export interface IDeviceTrustEventProps {
  id?: string;
  deviceId: string;
  userId: string;
  tenantId?: string;
  eventType: 'trusted' | 'untrusted' | 'blocked' | 'flagged' | 'verified';
  reason: string;
  createdBy: string;
  createdAt: Date;
  metadataJson: string;
}

export class DeviceTrustEventEntity {
  public readonly id!: string;
  public readonly deviceId: string;
  public readonly userId: string;
  public readonly tenantId?: string;
  public readonly eventType: 'trusted' | 'untrusted' | 'blocked' | 'flagged' | 'verified';
  public readonly reason: string;
  public readonly createdBy: string;
  public readonly createdAt: Date;
  public readonly metadataJson: string;

  private constructor(props: IDeviceTrustEventProps) {
    if (props.id !== undefined) {
      this.id = props.id;
    }

    this.deviceId = props.deviceId;
    this.userId = props.userId;
    this.tenantId = props.tenantId;
    this.eventType = props.eventType;
    this.reason = props.reason;
    this.createdBy = props.createdBy;
    this.createdAt = props.createdAt;
    this.metadataJson = props.metadataJson;
  }

  public static createNew(
    deviceId: string,
    userId: string,
    eventType: 'trusted' | 'untrusted' | 'blocked' | 'flagged' | 'verified',
    reason: string,
    createdBy: string,
    metadataJson?: string,
    tenantId?: string,
  ): DeviceTrustEventEntity {
    return new DeviceTrustEventEntity({
      deviceId,
      userId,
      tenantId,
      eventType,
      reason,
      createdBy,
      createdAt: new Date(),
      metadataJson: metadataJson || '{}',
    });
  }

  public static restore(props: IDeviceTrustEventProps): DeviceTrustEventEntity {
    return new DeviceTrustEventEntity(props);
  }
}
