import { Email, Username } from '../value-objects';

export interface IUserProfileProps {
  id: string;
  username: Username;
  email: Email;

  firstName: string;
  lastName: string;

  displayName: string;

  avatar: string;
  locale: string;

  primaryContactId: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class UserProfileEntity {
  public readonly id: string;
  private _username: Username;
  private _email: Email;
  private _primaryContactId: string | null;
  private _firstName: string;
  private _lastName: string;

  private _displayName: string;
  private _avatar: string;
  private _locale: string;

  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: IUserProfileProps) {
    this.id = props.id;
    this._username = props.username;
    this._email = props.email;
    this._primaryContactId = props.primaryContactId;
    this._firstName = props.firstName;
    this._lastName = props.lastName;
    this._displayName = props.displayName;
    this._avatar = props.avatar;
    this._locale = props.locale;
    this._primaryContactId = props.primaryContactId;

    this._createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();
  }

  /**
   * Factory to create a new pending user
   */
  public static register(id: string, username: string, email: string, firstName = '', lastName = '', locale = 'EN_en'): UserProfileEntity {
    return new UserProfileEntity({
      id,
      username: Username.create(username),
      email: Email.create(email),
      firstName,
      lastName,
      displayName: `${firstName} ${lastName}`,
      avatar: '',
      locale: locale,
      primaryContactId: null,
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

  get primaryContactId(): string | null {
    return this._primaryContactId;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
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

  /**
   * Update primary contact id
   */
  public updatePrimaryContactId(newPrimaryContactId: string): void {
    this._primaryContactId = newPrimaryContactId;
    this.touchUpdatedAt();
  }

  private touchUpdatedAt(): void {
    this._updatedAt = new Date();
  }
}
