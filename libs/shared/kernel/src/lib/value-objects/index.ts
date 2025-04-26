export abstract class ValueObject<T> {
  constructor(protected readonly value: T) {}

  equals(vo?: ValueObject<T>): boolean {
    if (vo === null || vo === undefined) return false;
    if (vo.constructor.name !== this.constructor.name) return false;
    return JSON.stringify(vo.value) === JSON.stringify(this.value);
  }

  hashCode(): string {
    return JSON.stringify(this.value);
  }

  toString(): string {
    if (typeof this.value === 'object') {
      return JSON.stringify(this.value);
    }
    return String(this.value);
  }
}
