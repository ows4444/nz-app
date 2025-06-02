import { Password } from '../value-objects';

export interface IUserCredentialProps {
  userId: string;
  passwordHash: string;
  salt: string;
  hashAlgo: string;
  pepperVersion: string;
  lastPasswordChangedAt?: Date;
  passwordExpiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class UserCredentialEntity {
  public readonly userId: string;
  private _passwordHash: string;
  private _password: Password;
  private _salt: string;
  private _hashAlgo: string;
  private _pepperVersion: string;
  private _lastPasswordChangedAt?: Date;
  private _passwordExpiresAt?: Date;
  public readonly createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: IUserCredentialProps) {
    this.userId = props.userId;
    this._passwordHash = props.passwordHash;
    this._salt = props.salt;
    this._hashAlgo = props.hashAlgo;
    this._pepperVersion = props.pepperVersion;

    this._password = Password.fromStorage({
      passwordHash: props.passwordHash,
      salt: props.salt,
      algo: props.hashAlgo,
      pepperVersion: props.pepperVersion,
    });

    this._lastPasswordChangedAt = props.lastPasswordChangedAt;
    this._passwordExpiresAt = props.passwordExpiresAt;
    this.createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();
  }

  public static createNew(userId: string, password: string, pepper: string, algo: string, pepperVersion: string, passwordExpiresAt?: Date): UserCredentialEntity {
    const PasswordVO = Password.generate(password, pepper, pepperVersion, algo);
    return new UserCredentialEntity({
      userId,
      passwordHash: PasswordVO.props.passwordHash,
      salt: PasswordVO.props.salt,
      hashAlgo: PasswordVO.props.algo,
      pepperVersion: PasswordVO.props.pepperVersion,
      passwordExpiresAt,
      lastPasswordChangedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  public static restore(props: IUserCredentialProps): UserCredentialEntity {
    return new UserCredentialEntity(props);
  }

  public updatePassword(password: string, pepper: string, algo: string, pepperVersion: string, passwordExpiresAt?: Date): void {
    const PasswordVO = Password.generate(password, pepper, pepperVersion, algo);
    this._passwordHash = PasswordVO.props.passwordHash;
    this._salt = PasswordVO.props.salt;
    this._hashAlgo = PasswordVO.props.algo;
    this._pepperVersion = PasswordVO.props.pepperVersion;
    this._lastPasswordChangedAt = new Date(this._updatedAt);
    this._passwordExpiresAt = passwordExpiresAt;
    this.touchUpdatedAt();
  }

  public get passwordHash(): string {
    return this._passwordHash;
  }

  public get salt(): string {
    return this._salt;
  }

  public get hashAlgo(): string {
    return this._hashAlgo;
  }

  public get pepperVersion(): string {
    return this._pepperVersion;
  }

  public get lastPasswordChangedAt(): Date | undefined {
    return this._lastPasswordChangedAt;
  }

  public get passwordExpiresAt(): Date | undefined {
    return this._passwordExpiresAt;
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
