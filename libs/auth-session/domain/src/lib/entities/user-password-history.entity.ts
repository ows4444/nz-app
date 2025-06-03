import { Password } from '../value-objects';

export interface IUserPasswordHistoryProps {
  id?: number;
  userId: string;
  passwordHash: string;
  salt: string;
  hashAlgo: string;
  pepperVersion: string;
  changedAt: Date;
}

export class UserPasswordHistoryEntity {
  public readonly id!: number;
  public readonly userId: string;

  public readonly passwordHash: string;
  public readonly password: Password;
  public readonly salt: string;
  public readonly hashAlgo: string;
  public readonly pepperVersion: string;

  public readonly changedAt: Date;

  private constructor(props: IUserPasswordHistoryProps) {
    if (props.id !== undefined) {
      this.id = props.id;
    }
    this.userId = props.userId;
    this.passwordHash = props.passwordHash;
    this.salt = props.salt;
    this.hashAlgo = props.hashAlgo;
    this.pepperVersion = props.pepperVersion;

    this.password = Password.fromStorage({
      passwordHash: props.passwordHash,
      salt: props.salt,
      algo: props.hashAlgo,
      pepperVersion: props.pepperVersion,
    });
    this.changedAt = props.changedAt ?? new Date();
  }

  public static createNew(userId: string, password: string, pepper: string, algo: string, pepperVersion: string): UserPasswordHistoryEntity {
    const PasswordVO = Password.generate(password, pepper, pepperVersion, algo);
    return new UserPasswordHistoryEntity({
      userId,
      passwordHash: PasswordVO.props.passwordHash,
      salt: PasswordVO.props.salt,
      hashAlgo: PasswordVO.props.algo,
      pepperVersion: PasswordVO.props.pepperVersion,
      changedAt: new Date(),
    });
  }

  public static restore(props: IUserPasswordHistoryProps): UserPasswordHistoryEntity {
    return new UserPasswordHistoryEntity(props);
  }
}
