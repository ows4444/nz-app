import { BaseEntityProps } from '../interfaces';

export abstract class Entity<T extends BaseEntityProps<string | number>> {
  constructor(protected readonly props: T) {}

  get id(): T['id'] {
    return this.props.id;
  }

  equals(object?: Entity<T>): boolean {
    if (object === null || object === undefined) return false;
    if (this === object) return true;
    if (!(object instanceof Entity)) return false;
    return this.id === object.id;
  }

  hashCode(): string {
    return `${this.constructor.name}_${String(this.id)}`;
  }
}
