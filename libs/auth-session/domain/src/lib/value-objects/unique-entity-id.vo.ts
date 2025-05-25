import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

export interface UniqueEntityIdProps {
  id: string;
}

export class UniqueEntityId {
  private constructor(private readonly _value?: string) {}

  public static generate(): UniqueEntityId {
    return new UniqueEntityId(uuidv4());
  }

  public static fromString(id: string): UniqueEntityId {
    if (!uuidValidate(id)) {
      throw new Error(`UniqueEntityId: '${id}' is not a valid UUID`);
    }
    return new UniqueEntityId(id);
  }

  public getValue(): string {
    return String(this._value);
  }

  public equals(other: UniqueEntityId): boolean {
    return this._value === other.getValue();
  }
}
