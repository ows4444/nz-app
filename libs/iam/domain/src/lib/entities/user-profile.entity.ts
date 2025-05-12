export interface IUserProfileProps {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  avatarUrl: string;
  bio: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class UserProfileEntity {
  public readonly id: string;
  private _firstName: string;
  private _middleName: string;
  private _lastName: string;
  private _avatarUrl: string;
  private _bio: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: IUserProfileProps) {
    this.id = props.id;
    this._firstName = props.firstName;
    this._middleName = props.middleName;
    this._lastName = props.lastName;
    this._avatarUrl = props.avatarUrl;
    this._bio = props.bio;
    this._createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();
  }

  public static createNew(id: string, firstName: string, lastName: string, middleName: string, avatarUrl: string, bio: string): UserProfileEntity {
    return new UserProfileEntity({
      id,
      firstName,
      lastName,
      middleName,
      avatarUrl,
      bio,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  public static restore(props: IUserProfileProps): UserProfileEntity {
    return new UserProfileEntity(props);
  }

  public get firstName(): string {
    return this._firstName;
  }

  public get middleName(): string | undefined {
    return this._middleName;
  }

  public get lastName(): string {
    return this._lastName;
  }

  public get avatarUrl(): string | undefined {
    return this._avatarUrl;
  }

  public get bio(): string | undefined {
    return this._bio;
  }

  public get createdAt(): Date {
    return this._createdAt;
  }

  public get updatedAt(): Date {
    return this._updatedAt;
  }
  public updateProfile(firstName: string, middleName: string, lastName: string, avatarUrl: string, bio: string): void {
    this._firstName = firstName;
    this._middleName = middleName;
    this._lastName = lastName;
    this._avatarUrl = avatarUrl;
    this._bio = bio;
    this.touchUpdatedAt();
  }

  private touchUpdatedAt(): void {
    this._updatedAt = new Date();
  }
}
