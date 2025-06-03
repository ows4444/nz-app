export interface ISessionPolicyProps {
  id?: string;
  tenantId: string;
  maxConcurrentSessions: number;
  inactivityTimeoutMinutes: number;
  absoluteTimeoutHours: number;
  requireMFA: boolean;
  allowedIpRanges: string[];
  deviceTrustRequired: boolean;
  createdAt: Date;
  updatedAt: Date;
}
export class SessionPolicyEntity {
  public readonly id!: string;
  public readonly tenantId: string;

  private _maxConcurrentSessions: number;
  private _inactivityTimeoutMinutes: number;
  private _absoluteTimeoutHours: number;
  private _requireMFA: boolean;
  private _allowedIpRanges: string[];
  private _deviceTrustRequired: boolean;

  public readonly createdAt: Date;

  private _updatedAt: Date;

  private constructor(props: ISessionPolicyProps) {
    if (props.id !== undefined) {
      this.id = props.id;
    }
    this.tenantId = props.tenantId;
    this._maxConcurrentSessions = props.maxConcurrentSessions;
    this._inactivityTimeoutMinutes = props.inactivityTimeoutMinutes;
    this._absoluteTimeoutHours = props.absoluteTimeoutHours;
    this._requireMFA = props.requireMFA;
    this._allowedIpRanges = props.allowedIpRanges;
    this._deviceTrustRequired = props.deviceTrustRequired;

    this.createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }
  public static createNew(
    tenantId: string,
    maxConcurrentSessions: number,
    inactivityTimeoutMinutes: number,
    absoluteTimeoutHours: number,
    requireMFA: boolean,
    allowedIpRanges: string[],
    deviceTrustRequired: boolean,
  ): SessionPolicyEntity {
    return new SessionPolicyEntity({
      tenantId,
      maxConcurrentSessions,
      absoluteTimeoutHours,
      allowedIpRanges,
      deviceTrustRequired,
      inactivityTimeoutMinutes,
      requireMFA,
      updatedAt: new Date(),
      createdAt: new Date(),
    });
  }
  public static restore(props: ISessionPolicyProps): SessionPolicyEntity {
    return new SessionPolicyEntity(props);
  }

  public get maxConcurrentSessions(): number {
    return this._maxConcurrentSessions;
  }

  public get inactivityTimeoutMinutes(): number {
    return this._inactivityTimeoutMinutes;
  }

  public get absoluteTimeoutHours(): number {
    return this._absoluteTimeoutHours;
  }

  public get requireMFA(): boolean {
    return this._requireMFA;
  }

  public get allowedIpRanges(): string[] {
    return this._allowedIpRanges;
  }

  public get deviceTrustRequired(): boolean {
    return this._deviceTrustRequired;
  }

  public get updatedAt(): Date {
    return this._updatedAt;
  }
}
