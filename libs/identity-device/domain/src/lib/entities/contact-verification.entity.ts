export interface IContactVerificationProps {
  id?: number;
  contactId: string;
  purpose: string;
  tokenHash: string;
  code: string;
  deliveryMethod: 'sms' | 'email';
  expiresAt: Date;
  usedFlag: boolean;
  usedAt?: Date;

  attemptsCount: number;
  maxAttempts: number;

  requestedAt: Date;
  ipAddress: string;
  userAgent: string;
}

export class ContactVerificationEntity {
  public readonly id!: number;
  public readonly contactId!: string;
  public readonly purpose!: string;
  public readonly tokenHash!: string;
  public readonly code!: string;
  public readonly deliveryMethod!: 'sms' | 'email';
  public readonly expiresAt!: Date;
  public readonly requestedAt!: Date;
  public readonly ipAddress!: string;
  public readonly maxAttempts!: number;
  public readonly userAgent!: string;

  private _usedFlag: boolean;
  private _usedAt?: Date;

  private _attemptsCount: number;

  private constructor(props: IContactVerificationProps) {
    if (props.id !== undefined) {
      this.id = props.id;
    }

    this.contactId = props.contactId;
    this.purpose = props.purpose;
    this.tokenHash = props.tokenHash;
    this.code = props.code;
    this.requestedAt = props.requestedAt;
    this.expiresAt = props.expiresAt;
    this.ipAddress = props.ipAddress;
    this.userAgent = props.userAgent;
    this.maxAttempts = props.maxAttempts;
    this._usedFlag = props.usedFlag;

    this._usedAt = props.usedAt;
    this._attemptsCount = props.attemptsCount;

    this.deliveryMethod = props.deliveryMethod;
  }

  public static createNew(
    contactId: string,
    purpose: string,
    tokenHash: string,
    code: string,
    deliveryMethod: 'sms' | 'email',
    expiresAt: Date,
    maxAttempts: number,
    ipAddress: string,
    userAgent: string,
  ): ContactVerificationEntity {
    return new ContactVerificationEntity({
      contactId,
      purpose,
      tokenHash,
      code,
      deliveryMethod,
      expiresAt,
      attemptsCount: 0,
      maxAttempts,
      ipAddress,
      userAgent,
      usedFlag: false,
      requestedAt: new Date(),
    });
  }

  public static restore(props: IContactVerificationProps): ContactVerificationEntity {
    return new ContactVerificationEntity(props);
  }

  // ----------------- Getters -----------------

  public get usedFlag(): boolean {
    return this._usedFlag;
  }

  public get usedAt(): Date | undefined {
    return this._usedAt;
  }

  public get attemptsCount(): number {
    return this._attemptsCount;
  }

  public get isExpired(): boolean {
    return this.expiresAt < new Date();
  }

  public get isUsed(): boolean {
    return this._usedFlag;
  }

  public get isMaxAttemptsReached(): boolean {
    return this._attemptsCount >= this.maxAttempts;
  }

  // --------------- Business Methods ---------------

  public incrementAttemptsCount(): void {
    this._attemptsCount += 1;
  }

  public resetAttemptsCount(): void {
    this._attemptsCount = 0;
  }

  public markAsUsed(): void {
    this._usedFlag = true;
    this._usedAt = new Date();
  }
}
