export interface ILoginAttemptProps {
  id: string;
  userId: string;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
  successFlag: boolean;
}
export class LoginAttemptEntity {
  public readonly id: string;
  private _userId: string;
  private _ipAddress: string;
  private _userAgent: string;
  private _timestamp: Date;
  private _successFlag: boolean;
  private constructor(props: ILoginAttemptProps) {
    this.id = props.id;
    this._userId = props.userId;
    this._ipAddress = props.ipAddress;
    this._userAgent = props.userAgent;
    this._timestamp = props.timestamp;
    this._successFlag = props.successFlag;
  }
  public static createNew(id: string, userId: string, ipAddress: string, userAgent: string, successFlag: boolean): LoginAttemptEntity {
    return new LoginAttemptEntity({
      id,
      userId,
      ipAddress,
      userAgent,
      timestamp: new Date(),
      successFlag,
    });
  }
  public static restore(props: ILoginAttemptProps): LoginAttemptEntity {
    return new LoginAttemptEntity(props);
  }
  public get userId(): string {
    return this._userId;
  }
  public get ipAddress(): string {
    return this._ipAddress;
  }
  public get userAgent(): string {
    return this._userAgent;
  }
  public get timestamp(): Date {
    return this._timestamp;
  }
  public get successFlag(): boolean {
    return this._successFlag;
  }
}
