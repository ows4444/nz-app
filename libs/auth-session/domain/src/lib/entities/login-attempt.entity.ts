export interface ILoginAttemptProps {
  id?: number;
  userId: string;
  emailAttempted?: string;
  tenantId?: string;
  timestamp: Date;
  successFlag: boolean;
  failureReason?: string;
  ipAddress: string;
  userAgent: string;
  riskScore: number;
  locationData?: string;
  deviceFingerprint?: string;
}
export class LoginAttemptEntity {
  public readonly id!: number;
  public readonly userId: string;
  public readonly emailAttempted?: string;
  public readonly tenantId?: string;
  public readonly timestamp: Date;
  public readonly successFlag: boolean;
  public readonly failureReason?: string;
  public readonly ipAddress: string;
  public readonly userAgent: string;
  public readonly riskScore: number;
  public readonly locationData?: string;
  public readonly deviceFingerprint?: string;

  private constructor(props: ILoginAttemptProps) {
    if (props.id !== undefined) {
      this.id = props.id;
    }

    if (props.emailAttempted !== undefined) {
      this.emailAttempted = props.emailAttempted;
    }

    if (props.failureReason !== undefined) {
      this.failureReason = props.failureReason;
    }

    if (props.locationData !== undefined) {
      this.locationData = props.locationData;
    }

    if (props.deviceFingerprint !== undefined) {
      this.deviceFingerprint = props.deviceFingerprint;
    }

    this.userId = props.userId;
    this.tenantId = props.tenantId;
    this.ipAddress = props.ipAddress;
    this.userAgent = props.userAgent;
    this.timestamp = props.timestamp;
    this.successFlag = props.successFlag;
    this.riskScore = props.riskScore;
  }
  public static createNew(
    userId: string,
    ipAddress: string,
    userAgent: string,
    successFlag: boolean,
    riskScore: number,
    tenantId?: string,
    deviceFingerprint?: string,
    emailAttempted?: string,
    failureReason?: string,
    locationData?: string,
  ): LoginAttemptEntity {
    return new LoginAttemptEntity({
      userId,
      ipAddress,
      userAgent,
      timestamp: new Date(),
      successFlag,
      tenantId,
      riskScore,
      deviceFingerprint,
      emailAttempted,
      failureReason,
      locationData,
    });
  }
  public static restore(props: ILoginAttemptProps): LoginAttemptEntity {
    return new LoginAttemptEntity(props);
  }
}
