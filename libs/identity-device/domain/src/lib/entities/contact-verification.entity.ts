export interface IContactVerificationProps {
  id?: number;
  contactId: string;
  purpose: string;
  tokenHash: string;
  code: string;

  ipAddress: string;
  userAgent: string;

  usedFlag?: boolean;
  usedAt?: Date;

  expiresAt: Date;

  requestedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class ContactVerificationEntity {
  public readonly id!: number;
  public readonly contactId!: string;
  public readonly purpose!: string;
  public readonly tokenHash!: string;
  public readonly code!: string;
  public readonly expiresAt!: Date;
  public readonly requestedAt!: Date;
  public readonly ipAddress!: string;
  public readonly userAgent!: string;

  private _usedFlag: boolean;
  private _usedAt: Date;

  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: IContactVerificationProps) {
    if (props.id !== undefined) {
      this.id = props.id;
    }

    this.contactId = props.contactId;
    this.purpose = props.purpose;
    this.tokenHash = props.tokenHash;
    this.code = props.code;
    this.expiresAt = props.expiresAt;

    this._usedFlag = props.usedFlag ?? false;

    this.requestedAt = props.requestedAt;
    this._usedAt = props.usedAt ?? new Date();
    this.ipAddress = props.ipAddress;
    this.userAgent = props.userAgent;

    this._createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();
  }

  public static createNew(contactId: string, purpose: string, tokenHash: string, code: string, expiresAt: Date, ipAddress: string, userAgent: string): ContactVerificationEntity {
    return new ContactVerificationEntity({
      contactId,
      purpose,
      tokenHash,
      code,
      expiresAt,

      ipAddress,
      userAgent,
      usedFlag: false,
      requestedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  public static restore(props: IContactVerificationProps): ContactVerificationEntity {
    return new ContactVerificationEntity(props);
  }

  // ----------------- Getters -----------------

  get usedFlag(): boolean {
    return this._usedFlag;
  }

  get usedAt(): Date {
    return this._usedAt;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // --------------- Business Methods ---------------

  public markAsUsed(): void {
    this._usedFlag = true;
    this._usedAt = new Date();
    this.touchUpdatedAt();
  }

  private touchUpdatedAt(): void {
    this._updatedAt = new Date();
  }
}
