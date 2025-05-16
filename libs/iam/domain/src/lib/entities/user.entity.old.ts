import { Status } from '@nz/const';
import { Bitwise, State } from '@nz/kernel';
import { Email, Username } from '../value-objects';

export interface IUserProps {
  id: string;
  username: Username;
  email: Email;
  phone?: string;
  locale?: string;
  status?: Status;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  deletedAt?: Date;
  suspendedAt?: Date;
  suspendedUntil?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * UserEntity represents a system user with rich lifecycle methods.
 */
export class UserEntity extends State.StatefulEntity<Status> {
  private static readonly ALLOWED_STATUSES = Status.PENDING | Status.ACTIVE | Status.INACTIVE | Status.SUSPENDED | Status.DELETED;

  public readonly id: string;
  private _username: Username;
  private _email: Email;
  private _phone?: string;
  private _locale: string;

  private _isEmailVerified = false;
  private _isPhoneVerified = false;

  private _createdAt: Date;
  private _updatedAt: Date;

  private _deletedAt?: Date;
  private _suspendedAt?: Date;
  private _suspendedUntil?: Date;

  private _statusMessage = '';

  private constructor(props: IUserProps) {
    super(props.status ?? Status.PENDING, UserEntity.validateTransition);
    this.id = props.id;
    this._username = props.username;
    this._email = props.email;
    this._phone = props.phone;
    this._locale = props.locale ?? 'en-US';

    this._isEmailVerified = props.email ? props.status !== Status.PENDING : false;
    this._isPhoneVerified = props.phone ? props.status !== Status.PENDING : false;

    this._createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();

    this._deletedAt = props.deletedAt;

    this._suspendedAt = props.suspendedAt;
    this._suspendedUntil = props.suspendedUntil;

    this.refreshStatusMessage();
  }

  /**
   * Factory to create a new pending user
   */
  public static register(id: string, username: string, email: string, phone?: string, locale?: string): UserEntity {
    return new UserEntity({
      id,
      username: Username.create(username),
      email: Email.create(email),
      phone: phone,
      locale,
      status: Status.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  /**
   * Factory to rehydrate an existing user
   */
  public static restore(props: IUserProps): UserEntity {
    return new UserEntity(props);
  }

  // ----------------- Getters -----------------
  get username(): string {
    return this._username.getValue();
  }

  get email(): string {
    return this._email.getValue();
  }

  get phone(): string | undefined {
    return this._phone;
  }

  get locale(): string {
    return this._locale;
  }

  get isEmailVerified(): boolean {
    return this._isEmailVerified;
  }

  get isPhoneVerified(): boolean {
    return this._isPhoneVerified;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get deletedAt(): Date | undefined {
    return this._deletedAt;
  }

  get suspendedAt(): Date | undefined {
    return this._suspendedAt;
  }

  get suspendedUntil(): Date | undefined {
    return this._suspendedUntil;
  }

  get status(): Status {
    return this.getState();
  }

  get statusMessage(): string {
    return this._statusMessage;
  }

  // --------------- Business Methods ---------------

  /**
   * Update username
   */
  public updateUsername(newUsername: string): void {
    this._username = Username.create(newUsername);
    this.touchUpdatedAt();
  }

  /**
   * Update email and mark as unverified
   */
  public updateEmail(newEmail: string): void {
    this._email = Email.create(newEmail);
    this._isEmailVerified = false;
    this.touchUpdatedAt();
  }

  /**
   * Confirm email verification
   */
  public verifyEmail(): void {
    this._isEmailVerified = true;
    this.touchUpdatedAt();
  }

  /**
   * Update phone number and mark as unverified
   */
  public updatePhone(newPhone: string): void {
    this._phone = newPhone;
    this._isPhoneVerified = false;
    this.touchUpdatedAt();
  }

  /**
   * Confirm phone verification
   */
  public verifyPhone(): void {
    if (!this._phone) throw new Error('No phone to verify');
    this._isPhoneVerified = true;
    this.touchUpdatedAt();
  }

  /**
   * Change user locale
   */
  public changeLocale(newLocale: string): void {
    this._locale = newLocale;
    this.touchUpdatedAt();
  }

  /**
   * Activate a pending or inactive user
   */
  public activate(): void {
    this.transitionState(Status.ACTIVE);
    this.clearSuspension();
    this.touchUpdatedAt();
    this.refreshStatusMessage();
  }

  /**
   * Deactivate an active user
   */
  public deactivate(): void {
    this.transitionState(Status.INACTIVE);
    this.touchUpdatedAt();
    this.refreshStatusMessage();
  }

  /**
   * Suspend (temporarily revoke) a user for specified days
   */
  public suspend(days = 30): void {
    this.transitionState(Status.SUSPENDED);
    this._suspendedAt = new Date();
    this._suspendedUntil = new Date(Date.now() + days * 86400000);
    this.touchUpdatedAt();
    this.refreshStatusMessage();
  }

  /**
   * Unsuspend (reactivate) a suspended user
   */
  public unsuspend(): void {
    this.transitionState(Status.ACTIVE);
    this.clearSuspension();
    this.touchUpdatedAt();
    this.refreshStatusMessage();
  }

  /**
   * Permanently mark user as deleted
   */
  public delete(): void {
    this.transitionState(Status.DELETED);
    this._deletedAt = new Date();
    this.touchUpdatedAt();
    this.refreshStatusMessage();
  }

  /**
   * Restore a user from deleted state
   */
  public restore(): void {
    if (this._deletedAt == null) throw new Error('User is not deleted');
    this.transitionState(Status.ACTIVE);
    this._deletedAt = undefined;
    this.touchUpdatedAt();
    this.refreshStatusMessage();
  }

  // --------------- State Checkers ---------------

  public get isPending(): boolean {
    return Bitwise.hasFlag(this.status, Status.PENDING);
  }

  public get isActive(): boolean {
    return Bitwise.hasFlag(this.status, Status.ACTIVE);
  }

  public get isInactive(): boolean {
    return Bitwise.hasFlag(this.status, Status.INACTIVE);
  }

  public get isSuspended(): boolean {
    return Bitwise.hasFlag(this.status, Status.SUSPENDED);
  }

  public get isDeleted(): boolean {
    return Bitwise.hasFlag(this.status, Status.DELETED);
  }

  private static validateTransition(current: Status, next: Status): boolean {
    if ((next & ~UserEntity.ALLOWED_STATUSES) !== 0) return false;
    if (Bitwise.hasFlag(current, Status.DELETED) && next !== Status.ACTIVE) return false;
    if (Bitwise.hasFlag(current, Status.SUSPENDED) && next !== Status.ACTIVE) return false;
    if (Bitwise.hasFlag(current, Status.PENDING) && next !== Status.ACTIVE) return false;
    if (Bitwise.hasFlag(current, Status.ACTIVE) && next === Status.PENDING) return false;
    return true;
  }

  private clearSuspension(): void {
    this._suspendedAt = undefined;
    this._suspendedUntil = undefined;
  }

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
