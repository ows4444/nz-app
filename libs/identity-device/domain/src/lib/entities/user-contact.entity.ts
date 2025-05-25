export interface IUserContactProps {
  id?: number;
  userId: string;
  type: 'email' | 'phone';
  value: string;
  isVerified: boolean;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class UserContactEntity {
  public readonly id!: number;
  private _userId: string;
  private _type: 'email' | 'phone';
  private _value: string;
  private _isVerified: boolean;
  private _isDefault: boolean;

  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: IUserContactProps) {
    if (props.id !== undefined) {
      this.id = props.id;
    }

    this._userId = props.userId;
    this._type = props.type;
    this._value = props.value;
    this._isVerified = props.isVerified;
    this._isDefault = props.isDefault;

    this._createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();
  }

  /**
   * Factory to create a new pending user
   */
  public static createNew(userId: string, type: 'email' | 'phone', value: string): UserContactEntity {
    return new UserContactEntity({
      userId: userId,
      type,
      value,
      isVerified: false,
      isDefault: false,
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

  get userId(): string {
    return this._userId;
  }
  get type(): 'email' | 'phone' {
    return this._type;
  }
  get value(): string {
    return this._value;
  }
  get isVerified(): boolean {
    return this._isVerified;
  }

  get isDefault(): boolean {
    return this._isDefault;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // --------------- Business Methods ---------------

  public verify(): void {
    this._isVerified = true;
    this.touchUpdatedAt();
  }
  public updateValue(newValue: string): void {
    this._value = newValue;
    this._isVerified = false;
    this.touchUpdatedAt();
  }
  public setDefault(): void {
    this._isDefault = true;
    this.touchUpdatedAt();
  }
  public unsetDefault(): void {
    this._isDefault = false;
    this.touchUpdatedAt();
  }
  public updateType(newType: 'email' | 'phone'): void {
    this._type = newType;
    this._isVerified = false;
    this.touchUpdatedAt();
  }

  private touchUpdatedAt(): void {
    this._updatedAt = new Date();
  }
}
