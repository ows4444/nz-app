export interface IUserSessionProps {
  id?: string;
  userId: string;
  tenantId: string;
  deviceFingerprint: string;
  sessionTokenHash: string;
  ipAddress: string;
  userAgent: string;
  startedAt: Date;
  lastActivityAt: Date;
  expiresAt: Date;
  terminatedAt?: Date;
  terminationReason?: string;
  isActive: boolean;
}
export class UserSessionEntity {
  public readonly id!: string;
  public readonly userId: string;
  public readonly tenantId: string;
  public readonly deviceFingerprint: string;
  public readonly sessionTokenHash: string;
  public readonly userAgent: string;
  public readonly ipAddress: string;
  public readonly startedAt: Date;
  public _lastActivityAt: Date;
  public readonly expiresAt: Date;
  public _terminatedAt?: Date;
  public _terminationReason?: string;
  public _isActive: boolean;

  private constructor(props: IUserSessionProps) {
    if (props.id !== undefined) {
      this.id = props.id;
    }
    this.userId = props.userId;
    this.tenantId = props.tenantId;
    this.deviceFingerprint = props.deviceFingerprint;
    this.sessionTokenHash = props.sessionTokenHash;
    this.ipAddress = props.ipAddress;
    this.userAgent = props.userAgent;
    this.startedAt = props.startedAt;
    this._lastActivityAt = props.lastActivityAt;
    this.expiresAt = props.expiresAt;
    this._terminatedAt = props.terminatedAt;
    this._terminationReason = props.terminationReason;
    this._isActive = props.isActive;
  }
  public static createNew(userId: string, tenantId: string, deviceFingerprint: string, sessionTokenHash: string, ipAddress: string, userAgent: string, expiresAt: Date): UserSessionEntity {
    return new UserSessionEntity({
      userId,
      tenantId,
      deviceFingerprint,
      sessionTokenHash,
      ipAddress,
      userAgent,
      startedAt: new Date(),
      lastActivityAt: new Date(),
      expiresAt,
      isActive: true,
    });
  }
  public static restore(props: IUserSessionProps): UserSessionEntity {
    return new UserSessionEntity(props);
  }

  public updateLastActivity(): void {
    this._lastActivityAt = new Date();
  }

  public terminate(reason?: string): void {
    this._terminatedAt = new Date();
    this._terminationReason = reason;
    this._isActive = false;
  }

  public get isActive(): boolean {
    return this._isActive && new Date() < this.expiresAt;
  }

  public get lastActivityAt(): Date {
    return this._lastActivityAt;
  }

  public get terminatedAt(): Date | undefined {
    return this._terminatedAt;
  }

  public get terminationReason(): string | undefined {
    return this._terminationReason;
  }
}
