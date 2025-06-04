import { Status } from '@nz/const';
import { Bitwise, State } from '@nz/kernel';

export interface IUserProfileProps {
  id?: string;
  tenantId?: string;
  firstName: string;
  lastName: string;
  displayName: string;
  locale: string;
  timezone: string;
  avatarUrl: string;
  bio: string;
  status: Status;
  profileVisibility: string;
  lastLoginAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class UserProfileEntity extends State.StatefulEntity<Status> {
  private static readonly ALLOWED_STATUSES = Status.PENDING | Status.ACTIVE | Status.INACTIVE | Status.DELETED;
  public readonly id!: string;
  public readonly tenantId?: string;

  private _firstName: string;
  private _lastName: string;
  private _displayName: string;
  private _locale: string;
  private _timezone: string;
  private _avatarUrl: string;
  private _bio: string;
  private _profileVisibility: string;
  private _lastLoginAt: Date;

  public readonly createdAt: Date;
  private _updatedAt: Date;

  private _statusMessage = '';

  private constructor(props: IUserProfileProps) {
    super(props.status ?? Status.PENDING, UserProfileEntity.validateTransition);
    if (props.id !== undefined) {
      this.id = props.id;
    }
    this.tenantId = props.tenantId;

    this._firstName = props.firstName;
    this._lastName = props.lastName;
    this._displayName = props.displayName;
    this._locale = props.locale;
    this._timezone = props.timezone;
    this._avatarUrl = props.avatarUrl;
    this._bio = props.bio;
    this._profileVisibility = props.profileVisibility;
    this._lastLoginAt = props.lastLoginAt;

    this.createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;

    this.refreshStatusMessage();
  }

  /**
   * Factory to create a new pending user
   */
  public static register(firstName: string, lastName: string, locale = 'EN_en', timezone = '', bio = '', tenantId?: string): UserProfileEntity {
    return new UserProfileEntity({
      tenantId,
      firstName,
      lastName,
      status: Status.PENDING,
      displayName: [firstName, lastName].filter(Boolean).join(' '),
      locale,
      timezone,
      avatarUrl: '',
      bio,
      profileVisibility: 'public',
      lastLoginAt: new Date(),
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

  get locale(): string {
    return this._locale;
  }

  get timezone(): string {
    return this._timezone;
  }

  get status(): Status {
    return this.getState();
  }

  get avatarUrl(): string {
    return this._avatarUrl;
  }
  get bio(): string {
    return this._bio;
  }

  get profileVisibility(): string {
    return this._profileVisibility;
  }

  get lastLoginAt(): Date {
    return this._lastLoginAt;
  }

  get statusMessage(): string {
    return this._statusMessage;
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
  public updateAvatar(avatarUrl: string): void {
    this._avatarUrl = avatarUrl;
    this.touchUpdatedAt();
  }

  /**
   * Update locale
   */
  public updateLocale(newLocale: string): void {
    this._locale = newLocale;
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
