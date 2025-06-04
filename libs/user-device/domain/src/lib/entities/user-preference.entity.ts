export interface IUserPreferenceProps {
  id?: string;
  userId: string;
  tenantId?: string;
  category: string;
  preferenceKey: string;
  preferenceValue: string;
  dataType: string;
  isEncrypted: boolean;
  updatedAt: Date;
}

export class UserPreferenceEntity {
  public readonly id!: string;
  public readonly tenantId?: string;
  public readonly userId: string;

  private _category: string;
  private _preferenceKey: string;
  private _preferenceValue: string;
  private _dataType: string;
  private _isEncrypted: boolean;
  private _updatedAt: Date;

  private constructor(props: IUserPreferenceProps) {
    this.userId = props.userId;
    this.tenantId = props.tenantId;

    this._category = props.category;
    this._preferenceKey = props.preferenceKey;
    this._preferenceValue = props.preferenceValue;
    this._dataType = props.dataType;
    this._isEncrypted = props.isEncrypted;

    this._updatedAt = props.updatedAt;
  }

  public static createNew(userId: string, category: string, preferenceKey: string, preferenceValue: string, dataType: string, isEncrypted: boolean, tenantId?: string): UserPreferenceEntity {
    return new UserPreferenceEntity({
      userId,
      tenantId,
      category,
      preferenceKey,
      preferenceValue,
      dataType,
      isEncrypted,
      updatedAt: new Date(),
    });
  }

  public static restore(props: IUserPreferenceProps): UserPreferenceEntity {
    return new UserPreferenceEntity(props);
  }

  // ----------------- Getters -----------------

  public get category(): string {
    return this._category;
  }

  public get preferenceKey(): string {
    return this._preferenceKey;
  }

  public get preferenceValue(): string {
    return this._preferenceValue;
  }

  public get dataType(): string {
    return this._dataType;
  }

  public get isEncrypted(): boolean {
    return this._isEncrypted;
  }

  public get updatedAt(): Date {
    return this._updatedAt;
  }

  // --------------- Business Methods ---------------

  public updatePreferenceValue(newValue: string): void {
    this._preferenceValue = newValue;
    this.touchUpdatedAt();
  }
  public updateCategory(newCategory: string): void {
    this._category = newCategory;
    this.touchUpdatedAt();
  }

  public updatePreferenceKey(newKey: string): void {
    this._preferenceKey = newKey;
    this.touchUpdatedAt();
  }

  public updateDataType(newDataType: string): void {
    this._dataType = newDataType;
    this.touchUpdatedAt();
  }

  private touchUpdatedAt(): void {
    this._updatedAt = new Date();
  }
}
