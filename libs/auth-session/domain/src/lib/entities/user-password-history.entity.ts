import { Password } from '../value-objects';

export interface IUserPasswordHistoryProps {
  id?: number;
  userId: string;
  passwordHash: string;
  salt: string;
  algo: string;
  pepperVersion: string;
  createdAt: Date;
}

export class UserPasswordHistoryEntity {
  public readonly id!: number;
  public readonly userId: string;

  public readonly passwordHash: string;
  public readonly password: Password;
  public readonly salt: string;
  public readonly algo: string;
  public readonly pepperVersion: string;

  public readonly createdAt: Date;

  private constructor(props: IUserPasswordHistoryProps) {
    if (props.id !== undefined) {
      this.id = props.id;
    }
    this.userId = props.userId;
    this.passwordHash = props.passwordHash;
    this.salt = props.salt;
    this.algo = props.algo;
    this.pepperVersion = props.pepperVersion;

    this.password = Password.fromStorage({
      passwordHash: props.passwordHash,
      salt: props.salt,
      algo: props.algo,
      pepperVersion: props.pepperVersion,
    });
    this.createdAt = props.createdAt ?? new Date();
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
}
