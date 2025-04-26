import { Status } from '@nz/const';
import { Bitwise, State } from '@nz/kernel';

export class UserAccountEntity extends State.StatefulEntity<Status> {
  public static allowedFlags: number = Status.ACTIVE | Status.INACTIVE | Status.DELETED;
  public statusMessage!: string;

  public id: string;

  public username: string;
  public passwordHash: string;
  public email: string;
  public emailVerified: boolean;
  public status: Status;

  constructor({
    id,
    username,
    passwordHash,
    email,
    emailVerified = false,
    status = Status.PENDING,
  }: {
    id: string;
    username: string;
    emailVerified?: boolean;
    passwordHash: string;
    email: string;
    status: Status;
  }) {
    super(status, UserAccountEntity.validator);
    this.id = id;
    this.username = username;
    this.passwordHash = passwordHash;
    this.emailVerified = emailVerified;
    this.email = email;
    this.status = this.getState();
    this.setStateMessage();
  }

  private setStateMessage = (): void => {
    this.statusMessage = Object.values(Status)
      .filter((value) => typeof value === 'number')
      .reduce((acc: string, value): string => {
        const key = Status[value as unknown as number];
        if (Bitwise.hasFlag(this.status, value as unknown as number)) {
          acc += key + ' ';
        }
        return acc;
      }, '')
      .trim();
  };

  private static validator = (current: Status, next: Status): boolean => {
    if ((next & ~UserAccountEntity.allowedFlags) !== 0) return false;
    if (Bitwise.hasFlag(current, Status.DELETED) && next !== Status.ACTIVE) return false;
    return true;
  };

  private applyStateChange(newState: Status): void {
    this.transitionState(newState);
    this.status = this.getState();
    this.setStateMessage();
  }

  activate(): void {
    this.applyStateChange(Status.ACTIVE);
  }

  deactivate(): void {
    this.applyStateChange(Status.INACTIVE);
  }

  get isDeleted(): boolean {
    return Bitwise.hasFlag(this.getState(), Status.DELETED);
  }

  get isActive(): boolean {
    return Bitwise.hasFlag(this.getState(), Status.ACTIVE);
  }

  get isInactive(): boolean {
    return Bitwise.hasFlag(this.getState(), Status.INACTIVE);
  }

  get isSuspended(): boolean {
    return !Bitwise.hasFlag(this.getState(), Status.ACTIVE);
  }
}
