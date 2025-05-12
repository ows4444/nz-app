import { Password } from '../value-objects';

export interface IUserCredentialProps {
  id: string;
  password_hash: Password;
  salt: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class UserCredentialEntity {
  public readonly id: string;
  private _password_hash: Password;
  private _salt: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: IUserCredentialProps) {
    this.id = props.id;
    this._password_hash = props.password_hash;
    this._salt = props.salt;
    this._createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();
  }

  public static createNew(id: string, rawPassword: string, rawSalt: string): UserCredentialEntity {
    return new UserCredentialEntity({
      id,
      password_hash: Password.create(rawPassword),
      salt: rawSalt,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  public static restore(props: IUserCredentialProps): UserCredentialEntity {
    return new UserCredentialEntity(props);
  }

  public get password_hash(): string {
    return this._password_hash.getValue();
  }

  public get salt(): string {
    return this._salt;
  }

  public get createdAt(): Date {
    return this._createdAt;
  }

  public get updatedAt(): Date {
    return this._updatedAt;
  }

  public async validatePassword(plain: string): Promise<boolean> {
    return this._password_hash.compare(plain);
  }

  public async changePassword(newPassword: string): Promise<void> {
    this._password_hash = Password.create(newPassword);
    this.touchUpdatedAt();
  }

  private touchUpdatedAt(): void {
    this._updatedAt = new Date();
  }
}
