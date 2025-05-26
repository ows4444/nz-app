import { Password } from '../value-objects';

export interface IUserPasswordHistoryProps {
  id?: number;
  userId: string;
  passwordHash: string;
  salt: string;
  algo: string;
  pepperVersion: string;
  createdAt?: Date;
}

export class UserPasswordHistoryEntity {
  public readonly id!: number;
  public readonly userId: string;
  private _passwordHash: string;
  private _password: Password;
  private _salt: string;
  private _algo: string;
  private _pepperVersion: string;
  private _createdAt: Date;

  private constructor(props: IUserPasswordHistoryProps) {
    if (props.id !== undefined) {
      this.id = props.id;
    }
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
    this._createdAt = props.createdAt ?? new Date();
  }

  public static createNew(userId: string, password: string, pepper: string, algo: string, pepperVersion: string): UserPasswordHistoryEntity {
    const PasswordVO = Password.generate(password, pepper, pepperVersion, algo);
    return new UserPasswordHistoryEntity({
      userId,
      passwordHash: PasswordVO.props.passwordHash,
      salt: PasswordVO.props.salt,
      algo: PasswordVO.props.algo,
      pepperVersion: PasswordVO.props.pepperVersion,
      createdAt: new Date(),
    });
  }

  public static restore(props: IUserPasswordHistoryProps): UserPasswordHistoryEntity {
    return new UserPasswordHistoryEntity(props);
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

  public get createdAt(): Date {
    return this._createdAt;
  }

  public get password(): Password {
    return this._password;
  }
}
