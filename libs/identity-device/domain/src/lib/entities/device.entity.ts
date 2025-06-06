import { Status } from '@nz/const';
import { Bitwise, State } from '@nz/kernel';

export interface IDeviceProps {
  id?: string;
  deviceId: string;
  deviceInfo: string;
  lastSeenAt: Date;
  status: number;
  trustScore: number;
  createdAt: Date;
  updatedAt: Date;
}

export class DeviceEntity extends State.StatefulEntity<Status> {
  private static readonly ALLOWED_STATUSES = Status.PENDING | Status.ACTIVE | Status.INACTIVE | Status.DELETED;

  public readonly id!: string;
  public readonly deviceId: string;
  public readonly deviceInfo: string;

  private _lastSeenAt: Date;
  private _trustScore: number;

  public readonly createdAt: Date;
  private _updatedAt: Date;

  private _statusMessage = '';

  private constructor(props: IDeviceProps) {
    super(props.status ?? Status.PENDING, DeviceEntity.validateTransition);
    if (props.id !== undefined) {
      this.id = props.id;
    }
    this.deviceId = props.deviceId;
    this.deviceInfo = props.deviceInfo;

    this._trustScore = props.trustScore;

    this._lastSeenAt = props.lastSeenAt ?? new Date();
    this.createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();
    this.refreshStatusMessage();
  }

  public static createNew(deviceId: string, deviceInfo: string): DeviceEntity {
    return new DeviceEntity({
      deviceId,
      deviceInfo,
      lastSeenAt: new Date(),
      status: Status.PENDING,
      trustScore: 100,
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

  get updatedAt(): Date {
    return this._updatedAt;
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

  private touchUpdatedAt(): void {
    this._updatedAt = new Date();
  }
}
