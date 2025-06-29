export interface IDeviceSessionProps {
  id?: string;
  deviceId: string;
  userId: string;
  tenantId?: string;
  activeFlag: boolean;
  ipAddress: string;
  startedAt: Date;
  lastSeenAt: Date;
  geoLocation: string;
  city: string;
  country: string;
  sessionDurationMinutes: number;
}

export class DeviceSessionEntity {
  public readonly id!: string;
  public readonly deviceId: string;
  public readonly userId: string;
  public readonly tenantId?: string;

  private _activeFlag: boolean;
  private _ipAddress: string;
  private _startedAt: Date;
  private _lastSeenAt: Date;
  private _geoLocation: string;
  private _city: string;
  private _country: string;
  public _sessionDurationMinutes: number;

  private constructor(props: IDeviceSessionProps) {
    if (props.id !== undefined) {
      this.id = props.id;
    }

    this.userId = props.userId;
    this.deviceId = props.deviceId;
    this.tenantId = props.tenantId;
    this._sessionDurationMinutes = props.sessionDurationMinutes;
    this._activeFlag = props.activeFlag;
    this._ipAddress = props.ipAddress;
    this._startedAt = props.startedAt;
    this._lastSeenAt = props.lastSeenAt;
    this._geoLocation = props.geoLocation;
    this._city = props.city;
    this._country = props.country;
  }

  public static createNew(deviceId: string, userId: string, ipAddress: string, geoLocation: string, city: string, country: string, tenantId?: string): DeviceSessionEntity {
    return new DeviceSessionEntity({
      deviceId,
      userId,
      tenantId,
      ipAddress,
      geoLocation,
      city,
      country,
      activeFlag: true,
      lastSeenAt: new Date(),
      sessionDurationMinutes: 0,
      startedAt: new Date(),
    });
  }

  public static restore(props: IDeviceSessionProps): DeviceSessionEntity {
    return new DeviceSessionEntity(props);
  }

  // ----------------- Getters -----------------

  public get activeFlag(): boolean {
    return this._activeFlag;
  }

  public get ipAddress(): string {
    return this._ipAddress;
  }

  public get startedAt(): Date {
    return this._startedAt;
  }

  public get lastSeenAt(): Date {
    return this._lastSeenAt;
  }

  public get geoLocation(): string {
    return this._geoLocation;
  }

  public get city(): string {
    return this._city;
  }

  public get country(): string {
    return this._country;
  }

  public get sessionDurationMinutes(): number {
    return this._sessionDurationMinutes;
  }

  // --------------- Business Methods ---------------

  public updateLastSeen(ipAddress: string, geoLocation: string, city: string, country: string): void {
    this._ipAddress = ipAddress;
    this._geoLocation = geoLocation;
    this._city = city;
    this._country = country;
    this._lastSeenAt = new Date();
    this._sessionDurationMinutes = Math.floor((this._lastSeenAt.getTime() - this._startedAt.getTime()) / 60000);
  }

  public endSession(): void {
    this._activeFlag = false;
    this._sessionDurationMinutes = Math.floor((new Date().getTime() - this._startedAt.getTime()) / 60000);
  }
}
