export interface IDeviceSessionProps {
  sessionId: string;
  deviceId: string;
  userId: string;
  ipAddress: string;
  geoLocation: string;

  startedAt: Date;
  lastSeenAt: Date;
  activeFlag: boolean;
}
export class DeviceSessionEntity {
  public readonly sessionId!: string;
  public readonly deviceId!: string;
  public readonly userId!: string;
  public readonly startedAt!: Date;
  private _activeFlag: boolean;
  private _ipAddress: string;
  private _lastSeenAt: Date;
  private _geoLocation: string;

  private constructor(props: IDeviceSessionProps) {
    this.sessionId = props.sessionId;
    this.deviceId = props.deviceId;
    this.userId = props.userId;
    this.startedAt = props.startedAt;
    this._activeFlag = props.activeFlag;
    this._ipAddress = props.ipAddress;

    this._lastSeenAt = props.lastSeenAt;
    this._geoLocation = props.geoLocation;
  }
  public static createNew(sessionId: string, deviceId: string, userId: string, ipAddress: string, geoLocation: string): DeviceSessionEntity {
    return new DeviceSessionEntity({
      userId,
      activeFlag: true,
      sessionId,
      deviceId,
      ipAddress,
      geoLocation,
      startedAt: new Date(),
      lastSeenAt: new Date(),
    });
  }
  public static restore(props: IDeviceSessionProps): DeviceSessionEntity {
    return new DeviceSessionEntity(props);
  }

  public get ipAddress(): string {
    return this._ipAddress;
  }

  public get geoLocation(): string {
    return this._geoLocation;
  }

  public get lastSeenAt(): Date {
    return this._lastSeenAt;
  }

  public get activeFlag(): boolean {
    return this._activeFlag;
  }

  public set activeFlag(value: boolean) {
    this._activeFlag = value;
  }
}
