import { Status } from '@nz/const';
import { Bitwise, State } from '@nz/kernel';
import { Email, Username } from '../value-objects';

export interface IUserProps {
  id?: string;
  username: Username;
  email: Email;

  firstName: string;
  lastName: string;

  displayName: string;

  avatar: string;
  locale: string;
  status: Status;

  mfaEnabled: boolean;

  emailVerifiedAt?: Date;
  phoneVerifiedAt?: Date;

  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class UserEntity extends State.StatefulEntity<Status> {
  private static readonly ALLOWED_STATUSES = Status.PENDING | Status.ACTIVE | Status.INACTIVE | Status.DELETED;
  public readonly id!: string;
  public readonly username: string;
  private _email: Email;
  private _firstName: string;
  private _lastName: string;

  private _displayName: string;
  private _avatar: string;
  private _locale: string;

  private _mfaEnabled: boolean;
  private _emailVerifiedAt!: Date;
  private _phoneVerifiedAt!: Date;

  public readonly createdAt: Date;
  private _updatedAt: Date;

  private _deletedAt?: Date;

  private _statusMessage = '';

  private constructor(props: IUserProps) {
    super(props.status ?? Status.PENDING, UserEntity.validateTransition);
    if (props.id !== undefined) {
      this.id = props.id;
    }

    this.username = props.username.getValue();
    this._email = props.email;
    this._firstName = props.firstName;
    this._lastName = props.lastName;
    this._displayName = props.displayName;
    this._avatar = props.avatar;
    this._locale = props.locale;

    this.createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();

    this._deletedAt = props.deletedAt;

    this._mfaEnabled = props.mfaEnabled;

    if (props.emailVerifiedAt !== undefined) {
      this._emailVerifiedAt = props.emailVerifiedAt;
    }
    if (props.phoneVerifiedAt !== undefined) {
      this._phoneVerifiedAt = props.phoneVerifiedAt;
    }

    this.refreshStatusMessage();
  }

  /**
   * Factory to create a new pending user
   */
  public static register(username: Username, email: Email, firstName = '', lastName = '', locale = 'EN_en', mfaEnabled = false): UserEntity {
    return new UserEntity({
      username,
      email,
      firstName,
      lastName,
      status: Status.PENDING,
      displayName: [firstName, lastName].filter(Boolean).join(' '),
      avatar: '',
      locale,
      mfaEnabled,
      phoneVerifiedAt: undefined,
      emailVerifiedAt: undefined,
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

  get emailVerifiedAt(): Date | undefined {
    return this._emailVerifiedAt;
  }

  get phoneVerifiedAt(): Date | undefined {
    return this._phoneVerifiedAt;
  }

  get deletedAt(): Date | undefined {
    return this._deletedAt;
  }

  get verifiedEmailAt(): Date | undefined {
    return this._emailVerifiedAt;
  }

  get verifiedPhoneAt(): Date | undefined {
    return this._phoneVerifiedAt;
  }

  get mfaEnabled(): boolean {
    return this._mfaEnabled;
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
    if ((next & ~UserEntity.ALLOWED_STATUSES) !== 0) return false;
    if (Bitwise.hasFlag(current, Status.DELETED) && next !== Status.ACTIVE) return false;
    if (Bitwise.hasFlag(current, Status.SUSPENDED) && next !== Status.ACTIVE) return false;
    if (Bitwise.hasFlag(current, Status.PENDING) && next !== Status.ACTIVE) return false;
    if (Bitwise.hasFlag(current, Status.ACTIVE) && next === Status.PENDING) return false;
    return true;
  }

  // --------------- Business Methods ---------------

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
