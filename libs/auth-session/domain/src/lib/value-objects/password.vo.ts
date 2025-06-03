import bcrypt from 'bcrypt';

export interface PasswordProps {
  passwordHash: string;
  salt: string;
  algo: string;
  pepperVersion: string;
}

export class Password {
  private constructor(private readonly _passwordHash: string, private readonly _salt: string, private readonly _algo: string, private readonly _pepperVersion: string) {}

  public static generate(plainText: string, pepper: string, pepperVersion: string, algo = 'bcrypt', cost = 12): Password {
    const salt = bcrypt.genSaltSync(cost);
    const hash = bcrypt.hashSync(plainText + pepper, salt);
    return new Password(hash, salt, algo, pepperVersion);
  }

  public static fromStorage(props: PasswordProps): Password {
    return new Password(props.passwordHash, props.salt, props.algo, props.pepperVersion);
  }

  public async verify(attempt: string, pepper: string): Promise<boolean> {
    return bcrypt.compare(attempt + pepper, this._passwordHash);
  }

  public get props(): PasswordProps {
    return {
      passwordHash: this._passwordHash,
      salt: this._salt,
      algo: this._algo,
      pepperVersion: this._pepperVersion,
    };
  }
}
