export interface IUserPreferenceProps {
  userId: string;
  key: string;
  value: string;
  source: string;
  createdAt: Date;
  updatedAt: Date;
}

export class UserPreferenceEntity {
  public readonly id!: number;
  public readonly userId: string;
  private _key: string;
  private _value: string;
  private _source: string;

  public readonly createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: IUserPreferenceProps) {
    this.userId = props.userId;
    this._key = props.key;
    this._value = props.value;

    this._source = props.source;

    this.createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();
  }

  public static createNew(userId: string, key: string, value: string, source: string): UserPreferenceEntity {
    return new UserPreferenceEntity({
      userId: userId,
      key,
      value,
      source,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  public static restore(props: IUserPreferenceProps): UserPreferenceEntity {
    return new UserPreferenceEntity(props);
  }

  // ----------------- Getters -----------------

  get key(): string {
    return this._key;
  }
  get source(): string {
    return this._source;
  }

  get value(): string {
    return this._value;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // --------------- Business Methods ---------------

  public setValue(value: string): void {
    this._value = value;
    this.touchUpdatedAt();
  }
  public setSource(source: string): void {
    this._source = source;
    this.touchUpdatedAt();
  }
  public setKey(key: string): void {
    this._key = key;
    this.touchUpdatedAt();
  }

  private touchUpdatedAt(): void {
    this._updatedAt = new Date();
  }
}
