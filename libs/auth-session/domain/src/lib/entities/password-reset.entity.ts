export interface IPasswordResetProps {
  id?: number;
  userId: string;
  tokenHash: string;
  tokenType: string;
  requestedAt: Date;
  expiresAt: Date;
  ipAddress: string;
  userAgent: string;
  usedFlag?: boolean;
  usedAt?: Date;
  attemptsCount?: number;
}
export class PasswordResetEntity {
  public readonly id!: number;
  public readonly userId: string;
  public readonly tokenHash: string;
  public readonly tokenType: string;
  public readonly expiresAt: Date;
  public readonly requestedAt: Date;
  public readonly ipAddress: string;
  public readonly userAgent: string;
  private _usedFlag!: boolean;
  private _usedAt?: Date;
  private _attemptsCount!: number;

  private constructor(props: IPasswordResetProps) {
    if (props.id !== undefined) {
      this.id = props.id;
    }
    this.userId = props.userId;
    this.tokenHash = props.tokenHash;
    this.tokenType = props.tokenType;
    this.expiresAt = props.expiresAt;
    this.requestedAt = props.requestedAt || new Date();
    this.ipAddress = props.ipAddress;
    this.userAgent = props.userAgent;
    this._usedFlag = props.usedFlag || false;
    this._usedAt = props.usedAt;
    this._attemptsCount = props.attemptsCount || 0;
  }

  public static createNew(userId: string, tokenHash: string, tokenType: string, expiresAt: Date, ipAddress: string, userAgent: string): PasswordResetEntity {
    return new PasswordResetEntity({
      userId,
      tokenHash,
      tokenType,
      expiresAt,
      ipAddress,
      userAgent,
      requestedAt: new Date(),
    });
  }
  public static restore(props: IPasswordResetProps): PasswordResetEntity {
    return new PasswordResetEntity(props);
  }

  public get usedFlag(): boolean {
    return this._usedFlag;
  }

  public get usedAt(): Date | undefined {
    return this._usedAt;
  }

  public get attemptsCount(): number {
    return this._attemptsCount;
  }

  public isExpired(): boolean {
    return this.expiresAt < new Date();
  }
  public isValid(tokenHash: string): boolean {
    return this.tokenHash === tokenHash && !this.isExpired();
  }
}
