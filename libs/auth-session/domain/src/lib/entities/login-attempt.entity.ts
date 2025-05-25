export interface ILoginAttemptProps {
  id?: number;
  userId: string;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
  successFlag: boolean;
  riskScore: number;
}
export class LoginAttemptEntity {
  public readonly id!: number;
  private _userId: string;
  private _ipAddress: string;
  private _userAgent: string;
  private _timestamp: Date;
  private _successFlag: boolean;
  private _riskScore: number;
  private constructor(props: ILoginAttemptProps) {
    if (props.id !== undefined) {
      this.id = props.id;
    }
    this._userId = props.userId;
    this._ipAddress = props.ipAddress;
    this._userAgent = props.userAgent;
    this._timestamp = props.timestamp;
    this._successFlag = props.successFlag;
    this._riskScore = props.riskScore;
  }
  public static createNew(userId: string, ipAddress: string, userAgent: string, successFlag: boolean, riskScore: number): LoginAttemptEntity {
    return new LoginAttemptEntity({
      userId,
      ipAddress,
      userAgent,
      timestamp: new Date(),
      successFlag,
      riskScore,
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

  public get riskScore(): number {
    return this._riskScore;
  }
}
