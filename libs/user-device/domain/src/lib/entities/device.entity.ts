import { Status } from '@nz/const';
import { Bitwise, State } from '@nz/kernel';

export interface IDeviceProps {
  id?: string;
  deviceFingerprint: string;
  deviceName: string;
  deviceType: string;
  osName: string;
  osVersion: string;
  browserName: string;
  browserVersion: string;
  deviceInfo: string;
  status: Status;
  trustScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  isTrusted: boolean;
  firstSeenAt: Date;
  lastSeenAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class DeviceEntity extends State.StatefulEntity<Status> {
  private static readonly ALLOWED_STATUSES = Status.PENDING | Status.ACTIVE | Status.INACTIVE | Status.DELETED;

  public readonly id!: string;
  public readonly deviceFingerprint: string;
  public readonly deviceName: string;
  public readonly deviceType: string;
  public readonly osName: string;
  public readonly osVersion: string;
  public readonly browserName: string;
  public readonly browserVersion: string;

  private _riskLevel: 'low' | 'medium' | 'high' | 'critical';
  private _isTrusted: boolean;
  private _trustScore: number;
  private _deviceInfo: string;

  public readonly firstSeenAt: Date;
  private _lastSeenAt: Date;

  public readonly createdAt: Date;
  private _updatedAt: Date;

  private _statusMessage = '';

  private constructor(props: IDeviceProps) {
    super(props.status ?? Status.PENDING, DeviceEntity.validateTransition);
    if (props.id !== undefined) {
      this.id = props.id;
    }
    this.deviceFingerprint = props.deviceFingerprint;
    this.deviceName = props.deviceName;
    this.deviceType = props.deviceType;
    this.osName = props.osName;
    this.osVersion = props.osVersion;
    this.browserName = props.browserName;
    this.browserVersion = props.browserVersion;
    this._deviceInfo = props.deviceInfo;
    this._riskLevel = props.riskLevel;
    this._isTrusted = props.isTrusted;
    this.firstSeenAt = props.firstSeenAt;
    this._lastSeenAt = props.lastSeenAt;
    this._trustScore = props.trustScore;
    this.createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;

    this.refreshStatusMessage();
  }

  public static createNew(
    deviceFingerprint: string,
    deviceName: string,
    deviceType: string,
    osName: string,
    osVersion: string,
    browserName: string,
    browserVersion: string,
    deviceInfo: string,
  ): DeviceEntity {
    return new DeviceEntity({
      deviceFingerprint,
      deviceName,
      deviceType,
      osName,
      osVersion,
      browserName,
      browserVersion,
      deviceInfo,
      status: Status.PENDING,
      trustScore: 0,
      riskLevel: 'low',
      isTrusted: false,
      firstSeenAt: new Date(),
      lastSeenAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  public static restore(props: IDeviceProps): DeviceEntity {
    return new DeviceEntity(props);
  }

  // ----------------- Getters -----------------

  get lastSeenAt(): Date {
    return this._lastSeenAt;
  }
  get status(): Status {
    return this.getState();
  }
  get trustScore(): number {
    return this._trustScore;
  }

  get statusMessage(): string {
    return this._statusMessage;
  }

  get deviceInfo(): string {
    return this._deviceInfo;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get riskLevel(): 'low' | 'medium' | 'high' | 'critical' {
    return this._riskLevel;
  }

  get isTrusted(): boolean {
    return this._isTrusted;
  }

  private static validateTransition(current: Status, next: Status): boolean {
    if ((next & ~DeviceEntity.ALLOWED_STATUSES) !== 0) return false;
    if (Bitwise.hasFlag(current, Status.DELETED) && next !== Status.ACTIVE) return false;
    if (Bitwise.hasFlag(current, Status.PENDING) && next !== Status.ACTIVE) return false;
    if (Bitwise.hasFlag(current, Status.ACTIVE) && next === Status.PENDING) return false;
    return true;
  }

  // --------------- Business Methods ---------------

  /**
   * Update last seen timestamp
   */
  public updateLastSeen(): void {
    this._lastSeenAt = new Date();
    this.touchUpdatedAt();
  }

  /**
   * Update trust score
   */
  public updateTrustScore(newTrustScore: number): void {
    this._trustScore = newTrustScore;
    this.touchUpdatedAt();
  }

  /**
   * Change device status
   */

  private refreshStatusMessage(): void {
    const flags = Object.values(Status).filter((v) => typeof v === 'number') as number[];
    this._statusMessage = flags
      .filter((flag) => Bitwise.hasFlag(this.status, flag))
      .map((flag) => Status[flag])
      .join(' ');
  }

  /**
   * Activate a pending or inactive device
   */
  public activate(): void {
    this.transitionState(Status.ACTIVE);
    this.touchUpdatedAt();
    this.refreshStatusMessage();
  }

  /**
   * Deactivate an active device
   */
  public deactivate(): void {
    this.transitionState(Status.INACTIVE);
    this.touchUpdatedAt();
    this.refreshStatusMessage();
  }

  private touchUpdatedAt(): void {
    this._updatedAt = new Date();
  }
}
