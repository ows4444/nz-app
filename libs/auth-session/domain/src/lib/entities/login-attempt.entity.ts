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
  public readonly userId: string;
  public readonly ipAddress: string;
  public readonly userAgent: string;
  public readonly timestamp: Date;
  public readonly successFlag: boolean;
  public readonly riskScore: number;
  private constructor(props: ILoginAttemptProps) {
    if (props.id !== undefined) {
      this.id = props.id;
    }
    this.userId = props.userId;
    this.ipAddress = props.ipAddress;
    this.userAgent = props.userAgent;
    this.timestamp = props.timestamp;
    this.successFlag = props.successFlag;
    this.riskScore = props.riskScore;
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
}
