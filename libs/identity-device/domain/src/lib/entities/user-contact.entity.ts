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
  public readonly userId: string;
  public readonly type: 'email' | 'phone';
  public readonly value: string;
  private _isVerified: boolean;
  private _isDefault: boolean;

  public readonly createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: IUserContactProps) {
    if (props.id !== undefined) {
      this.id = props.id;
    }

    this.userId = props.userId;
    this.type = props.type;
    this.value = props.value;
    this._isVerified = props.isVerified;
    this._isDefault = props.isDefault;

    this.createdAt = props.createdAt ?? new Date();
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

  get isVerified(): boolean {
    return this._isVerified;
  }

  get isDefault(): boolean {
    return this._isDefault;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // --------------- Business Methods ---------------

  public verify(): void {
    this._isVerified = true;
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

  private touchUpdatedAt(): void {
    this._updatedAt = new Date();
  }
}
