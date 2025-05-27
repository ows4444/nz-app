import { Status } from '@nz/const';
import { Bitwise, State } from '@nz/kernel';

export interface IUserDeviceProps {
  userId: string;
  deviceId: string;
  status: number;
  linkedAt?: Date;
}

export class UserDeviceEntity extends State.StatefulEntity<Status> {
  private static readonly ALLOWED_STATUSES = Status.PENDING | Status.ACTIVE | Status.INACTIVE | Status.DELETED;

  public readonly deviceId!: string;
  public readonly userId!: string;
  private _linkedAt: Date;
  private _statusMessage = '';

  private constructor(props: IUserDeviceProps) {
    super(props.status ?? Status.PENDING, UserDeviceEntity.validateTransition);
    if (props.deviceId !== undefined) {
      this.deviceId = props.deviceId;
    }
    this.userId = props.userId;
    this.deviceId = props.deviceId;
    this._linkedAt = props.linkedAt ?? new Date();

    this.refreshStatusMessage();
  }

  public static createNew(userId: string, deviceInfo: string): UserDeviceEntity {
    return new UserDeviceEntity({
      userId: userId,
      deviceId: deviceInfo,
      linkedAt: new Date(),
      status: Status.PENDING,
    });
  }

  public static restore(props: IUserDeviceProps): UserDeviceEntity {
    return new UserDeviceEntity(props);
  }

  // ----------------- Getters -----------------

  get linkedAt(): Date {
    return this._linkedAt;
  }
  get status(): Status {
    return this.getState();
  }

  get statusMessage(): string {
    return this._statusMessage;
  }

  private static validateTransition(current: Status, next: Status): boolean {
    if ((next & ~UserDeviceEntity.ALLOWED_STATUSES) !== 0) return false;
    if (Bitwise.hasFlag(current, Status.DELETED) && next !== Status.ACTIVE) return false;
    if (Bitwise.hasFlag(current, Status.PENDING) && next !== Status.ACTIVE) return false;
    if (Bitwise.hasFlag(current, Status.ACTIVE) && next === Status.PENDING) return false;
    return true;
  }

  // --------------- Business Methods ---------------

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
}
