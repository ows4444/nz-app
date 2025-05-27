import { Password } from '../value-objects';

export interface IUserCredentialProps {
  userId: string;
  passwordHash: string;
  salt: string;
  algo: string;
  pepperVersion: string;
  createdAt: Date;
  updatedAt: Date;
}

export class UserCredentialEntity {
  public readonly userId: string;
  private _passwordHash: string;
  private _password: Password;
  private _salt: string;
  private _algo: string;
  private _pepperVersion: string;
  public readonly createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: IUserCredentialProps) {
    this.userId = props.userId;
    this._passwordHash = props.passwordHash;
    this._salt = props.salt;
    this._algo = props.algo;
    this._pepperVersion = props.pepperVersion;

    this._password = Password.fromStorage({
      passwordHash: props.passwordHash,
      salt: props.salt,
      algo: props.algo,
      pepperVersion: props.pepperVersion,
    });
    this.createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();
  }

  public static createNew(userId: string, password: string, pepper: string, algo: string, pepperVersion: string): UserCredentialEntity {
    const PasswordVO = Password.generate(password, pepper, pepperVersion, algo);
    return new UserCredentialEntity({
      userId,
      passwordHash: PasswordVO.props.passwordHash,
      salt: PasswordVO.props.salt,
      algo: PasswordVO.props.algo,
      pepperVersion: PasswordVO.props.pepperVersion,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  public static restore(props: IUserCredentialProps): UserCredentialEntity {
    return new UserCredentialEntity(props);
  }

  public updatePassword(password: string, pepper: string, algo: string, pepperVersion: string): void {
    const PasswordVO = Password.generate(password, pepper, pepperVersion, algo);
    this._passwordHash = PasswordVO.props.passwordHash;
    this._salt = PasswordVO.props.salt;
    this._algo = PasswordVO.props.algo;
    this._pepperVersion = PasswordVO.props.pepperVersion;
    this.touchUpdatedAt();
  }

  public get passwordHash(): string {
    return this._passwordHash;
  }

  public get salt(): string {
    return this._salt;
  }

  public get algo(): string {
    return this._algo;
  }

  public get pepperVersion(): string {
    return this._pepperVersion;
  }

  public get updatedAt(): Date {
    return this._updatedAt;
  }

  public get password(): Password {
    return this._password;
  }

  private touchUpdatedAt(): void {
    this._updatedAt = new Date();
  }
}
