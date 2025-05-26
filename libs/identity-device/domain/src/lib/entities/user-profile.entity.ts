import { Status } from '@nz/const';
import { Bitwise, State } from '@nz/kernel';
import { Email, Username } from '../value-objects';

export interface IUserProfileProps {
  id?: string;
  username: Username;
  email: Email;

  firstName: string;
  lastName: string;

  displayName: string;

  avatar: string;
  locale: string;
  status: Status;
  deletedAt?: Date;
  suspendedAt?: Date;
  suspendedUntil?: Date;

  createdAt: Date;
  updatedAt: Date;
}

export class UserProfileEntity extends State.StatefulEntity<Status> {
  private static readonly ALLOWED_STATUSES = Status.PENDING | Status.ACTIVE | Status.INACTIVE | Status.SUSPENDED | Status.DELETED;
  public readonly id!: string;
  private _username: Username;
  private _email: Email;
  private _firstName: string;
  private _lastName: string;

  private _displayName: string;
  private _avatar: string;
  private _locale: string;

  private _createdAt: Date;
  private _updatedAt: Date;

  private _deletedAt?: Date;
  private _suspendedAt?: Date;
  private _suspendedUntil?: Date;

  private _statusMessage = '';

  private constructor(props: IUserProfileProps) {
    super(props.status ?? Status.PENDING, UserProfileEntity.validateTransition);
    if (props.id !== undefined) {
      this.id = props.id;
    }

    this._username = props.username;
    this._email = props.email;
    this._firstName = props.firstName;
    this._lastName = props.lastName;
    this._displayName = props.displayName;
    this._avatar = props.avatar;
    this._locale = props.locale;

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
  public static register(username: Username, email: Email, firstName = '', lastName = '', locale = 'EN_en'): UserProfileEntity {
    return new UserProfileEntity({
      username,
      email,
      firstName,
      lastName,
      status: Status.PENDING,
      displayName: [firstName, lastName].filter(Boolean).join(' '),
      avatar: '',
      locale: locale,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  /**
   * Factory to rehydrate an existing user
   */
  public static restore(props: IUserProfileProps): UserProfileEntity {
    return new UserProfileEntity(props);
  }

  // ----------------- Getters -----------------
  get username(): string {
    return this._username.getValue();
  }

  get email(): string {
    return this._email.getValue();
  }

  get firstName(): string {
    return this._firstName;
  }

  get lastName(): string {
    return this._lastName;
  }

  get displayName(): string {
    return this._displayName;
  }

  get fullName(): string {
    return `${this._firstName} ${this._lastName}`;
  }

  get avatar(): string {
    return this._avatar;
  }

  get locale(): string {
    return this._locale;
  }

  get status(): Status {
    return this.getState();
  }

  get statusMessage(): string {
    return this._statusMessage;
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

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
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
    if ((next & ~UserProfileEntity.ALLOWED_STATUSES) !== 0) return false;
    if (Bitwise.hasFlag(current, Status.DELETED) && next !== Status.ACTIVE) return false;
    if (Bitwise.hasFlag(current, Status.SUSPENDED) && next !== Status.ACTIVE) return false;
    if (Bitwise.hasFlag(current, Status.PENDING) && next !== Status.ACTIVE) return false;
    if (Bitwise.hasFlag(current, Status.ACTIVE) && next === Status.PENDING) return false;
    return true;
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
   * Update first name
   */
  public updateFirstName(newFirstName: string): void {
    this._firstName = newFirstName;
    this.touchUpdatedAt();
  }

  /**
   * Update last name
   */
  public updateLastName(newLastName: string): void {
    this._lastName = newLastName;
    this.touchUpdatedAt();
  }

  /**
   * Update display name
   */
  public updateDisplayName(newDisplayName: string): void {
    this._displayName = newDisplayName;
    this.touchUpdatedAt();
  }

  /**
   * Update avatar
   */
  public updateAvatar(newAvatar: string): void {
    this._avatar = newAvatar;
    this.touchUpdatedAt();
  }

  /**
   * Update locale
   */
  public updateLocale(newLocale: string): void {
    this._locale = newLocale;
    this.touchUpdatedAt();
  }

  /**
   * Update email and mark as unverified
   */
  public updateEmail(newEmail: string): void {
    this._email = Email.create(newEmail);
    this.touchUpdatedAt();
  }

  private clearSuspension(): void {
    this._suspendedAt = undefined;
    this._suspendedUntil = undefined;
    this.touchUpdatedAt();
    this.refreshStatusMessage();
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
