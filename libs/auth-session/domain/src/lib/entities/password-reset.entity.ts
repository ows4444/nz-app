export interface IPasswordResetProps {
  id?: number;
  userId: string;
  token: string;
  expiresAt: Date;
}
export class PasswordResetEntity {
  public readonly id!: number;
  public readonly userId: string;
  public readonly token: string;
  public readonly expiresAt: Date;

  private constructor(props: IPasswordResetProps) {
    if (props.id !== undefined) {
      this.id = props.id;
    }
    this.userId = props.userId;
    this.token = props.token;
    this.expiresAt = props.expiresAt;
  }

  public static createNew(userId: string, token: string, expiresAt: Date): PasswordResetEntity {
    return new PasswordResetEntity({
      userId,
      token,
      expiresAt,
    });
  }
  public static restore(props: IPasswordResetProps): PasswordResetEntity {
    return new PasswordResetEntity(props);
  }

  public isExpired(): boolean {
    return this.expiresAt < new Date();
  }
  public isValid(token: string): boolean {
    return this.token === token && !this.isExpired();
  }
}
