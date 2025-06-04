export interface IUserContactProps {
  id?: string;
  userId: string;
  tenantId?: string;
  type: 'email' | 'phone';
  label: string;
  value: string;
  verifiedFlag: boolean;
  verifiedAt?: Date;
  isPrimary: boolean;
  countryCode: string;
  createdAt: Date;
  updatedAt: Date;
}

export class UserContactEntity {
  public readonly id!: string;
  public readonly userId: string;
  public readonly tenantId?: string;
  public readonly type: 'email' | 'phone';

  private _label: string;
  private _value: string;
  private _verifiedFlag: boolean;
  private _verifiedAt?: Date;
  private _isPrimary: boolean;
  private _countryCode: string;

  public readonly createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: IUserContactProps) {
    if (props.id !== undefined) {
      this.id = props.id;
    }

    this.userId = props.userId;
    this.type = props.type;

    this._label = props.label;
    this._value = props.value;
    this._verifiedFlag = props.verifiedFlag;
    this._verifiedAt = props.verifiedAt;
    this._isPrimary = props.isPrimary;
    this._countryCode = props.countryCode;

    this.createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  /**
   * Factory to create a new pending user
   */
  public static createNew(userId: string, type: 'email' | 'phone', label: string, value: string, isPrimary: boolean, countryCode: string, tenantId?: string): UserContactEntity {
    return new UserContactEntity({
      userId,
      type,
      value,
      countryCode,
      label,
      isPrimary,
      tenantId,
      verifiedFlag: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  /**
   * Factory to rehydrate an existing user
   */
  public static restore(props: IUserContactProps): UserContactEntity {
    return new UserContactEntity(props);
  }

  // ----------------- Getters -----------------

  public get label(): string {
    return this._label;
  }

  public get value(): string {
    return this._value;
  }

  public get verifiedFlag(): boolean {
    return this._verifiedFlag;
  }

  public get verifiedAt(): Date | undefined {
    return this._verifiedAt;
  }

  public get isPrimary(): boolean {
    return this._isPrimary;
  }

  public get countryCode(): string {
    return this._countryCode;
  }

  public get updatedAt(): Date {
    return this._updatedAt;
  }

  // --------------- Business Methods ---------------

  public updateLabel(label: string): void {
    this._label = label;
    this.touchUpdatedAt();
  }

  public updateValue(value: string): void {
    this._value = value;
    this.touchUpdatedAt();
  }

  public verifyContact(): void {
    this._verifiedFlag = true;
    this._verifiedAt = new Date();
    this.touchUpdatedAt();
  }

  public setPrimary(): void {
    this._isPrimary = true;
    this.touchUpdatedAt();
  }

  public unsetPrimary(): void {
    this._isPrimary = false;
    this.touchUpdatedAt();
  }

  public updateCountryCode(countryCode: string): void {
    this._countryCode = countryCode;
    this.touchUpdatedAt();
  }

  private touchUpdatedAt(): void {
    this._updatedAt = new Date();
  }
}
