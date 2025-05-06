import { Status } from '@nz/const';
import { Bitwise, State } from '@nz/kernel';
import { Email, Password, Username } from '../value-objects';

export interface IUserAccountProps {
  id: string;
  username: Username;
  email: Email;
  password: Password;
  emailVerified?: boolean;
  status?: Status;
  createdAt?: Date;
  updatedAt?: Date;
}

export class UserAccountEntity extends State.StatefulEntity<Status> {
  private static readonly allowedFlags = Status.PENDING | Status.ACTIVE | Status.INACTIVE | Status.DELETED;

  public readonly id: string;
  private _username: Username;
  private _email: Email;
  private _password: Password;
  private _emailVerified: boolean;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _statusMessage = '';

  private constructor(props: IUserAccountProps) {
    super(props.status ?? Status.PENDING, UserAccountEntity.validateTransition);
    this.id = props.id;
    this._username = props.username;
    this._email = props.email;
    this._password = props.password;
    this._emailVerified = props.emailVerified ?? false;
    this._createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();
    this.updateStatusMessage();
  }

  /**
   * Factory for new UserAccountEntity (ID from DB, raw values)
   */
  public static async createNew(id: string, rawUsername: string, rawEmail: string, rawPassword: string, emailVerified = false): Promise<UserAccountEntity> {
    const usernameVO = Username.create(rawUsername);
    const emailVO = Email.create(rawEmail);
    const passwordVO = Password.create(rawPassword);
    return new UserAccountEntity({
      id,
      username: usernameVO,
      email: emailVO,
      password: passwordVO,
      emailVerified,
      status: Status.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  /**
   * Rehydrate an existing UserAccountEntity (all values provided)
   */
  public static restore(props: IUserAccountProps): UserAccountEntity {
    return new UserAccountEntity(props);
  }

  // -- Public getters --
  public get username(): string {
    return this._username.getValue();
  }

  public get email(): string {
    return this._email.getValue();
  }

  public get passwordHash(): string {
    return this._password.getValue();
  }

  public get emailVerified(): boolean {
    return this._emailVerified;
  }

  public get createdAt(): Date {
    return this._createdAt;
  }

  public get updatedAt(): Date {
    return this._updatedAt;
  }

  public get status(): Status {
    return this.getState();
  }

  public get statusMessage(): string {
    return this._statusMessage;
  }

  // -- Domain behaviors --

  /**
   * Validate a plaintext password against stored hash
   */
  public async validatePassword(plain: string): Promise<boolean> {
    return this._password.compare(plain);
  }

  /**
   * Change to a new password (will re-hash)
   */
  public async changePassword(newPassword: string): Promise<void> {
    this._password = await Password.create(newPassword);
    this.touchUpdatedAt();
  }

  /**
   * Change to a new email (validated and normalized)
   */
  public changeEmail(newEmail: string): void {
    this._email = Email.create(newEmail);
    this.touchUpdatedAt();
  }

  /**
   * Change to a new username (validated)
   */
  public changeUsername(newUsername: string): void {
    this._username = Username.create(newUsername);
    this.touchUpdatedAt();
  }

  public activate(): void {
    this.transitionState(Status.ACTIVE);
    this.updateStatusMessage();
    this.touchUpdatedAt();
  }

  public deactivate(): void {
    this.transitionState(Status.INACTIVE);
    this.updateStatusMessage();
    this.touchUpdatedAt();
  }

  public delete(): void {
    this.transitionState(Status.DELETED);
    this.updateStatusMessage();
    this.touchUpdatedAt();
  }

  // -- Convenience flags --
  public get isActive(): boolean {
    return Bitwise.hasFlag(this.getState(), Status.ACTIVE);
  }

  public get isInactive(): boolean {
    return Bitwise.hasFlag(this.getState(), Status.INACTIVE);
  }

  public get isDeleted(): boolean {
    return Bitwise.hasFlag(this.getState(), Status.DELETED);
  }

  // -- Private utilities --

  /**
   * Enforce valid status transitions
   */
  private static validateTransition(current: Status, next: Status): boolean {
    if ((next & ~UserAccountEntity.allowedFlags) !== 0) return false;
    if (Bitwise.hasFlag(current, Status.DELETED) && next !== Status.ACTIVE) return false;
    return true;
  }

  /**
   * Update the human-readable state message
   */
  private updateStatusMessage(): void {
    const flags = Object.values(Status).filter((v) => typeof v === 'number') as number[];
    this._statusMessage = flags
      .filter((flag) => Bitwise.hasFlag(this.getState(), flag))
      .map((flag) => Status[flag])
      .join(' ');
  }

  /**
   * Refresh the updatedAt timestamp
   */
  private touchUpdatedAt(): void {
    this._updatedAt = new Date();
  }
}
