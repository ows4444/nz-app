import { Email, Username } from '../value-objects';

export interface IUserProps {
  id: string;
  username: Username;
  email: Email;
  primaryContactId: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class UserEntity {
  public readonly id: string;
  private _username: Username;
  private _email: Email;
  private _primaryContactId: string | null;

  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: IUserProps) {
    this.id = props.id;
    this._username = props.username;
    this._email = props.email;
    this._primaryContactId = props.primaryContactId;

    this._createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();
  }

  /**
   * Factory to create a new pending user
   */
  public static register(id: string, username: string, email: string): UserEntity {
    return new UserEntity({
      id,
      username: Username.create(username),
      email: Email.create(email),
      primaryContactId: null,
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
