export interface IPasswordResetProps {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
}
export class PasswordResetEntity {
  public readonly id: string;
  private _userId: string;
  private _token: string;
  private _expiresAt: Date;

  private constructor(props: IPasswordResetProps) {
    this.id = props.id;
    this._userId = props.userId;
    this._token = props.token;
    this._expiresAt = props.expiresAt;
  }

  public static createNew(id: string, userId: string, token: string, expiresAt: Date): PasswordResetEntity {
    return new PasswordResetEntity({
      id,
      userId,
      token,
      expiresAt,
    });
  }
  public static restore(props: IPasswordResetProps): PasswordResetEntity {
    return new PasswordResetEntity(props);
  }
  public get userId(): string {
    return this._userId;
  }
  public get token(): string {
    return this._token;
  }
  public get expiresAt(): Date {
    return this._expiresAt;
  }
  public isExpired(): boolean {
    return this._expiresAt < new Date();
  }
  public isValid(token: string): boolean {
    return this._token === token && !this.isExpired();
  }
}
