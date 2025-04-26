import { Entity } from '../entities';
import { InvalidDomainEventError } from '../errors';
import { DomainEvent } from '../events';
import { AggregateID, BaseAggregateProps } from '../interfaces';

export abstract class AggregateRoot<T extends AggregateID, Props extends BaseAggregateProps<T> = BaseAggregateProps<T>> extends Entity<Props> {
  private _domainEvents: DomainEvent[] = [];
  private _version: number;

  constructor(props: Props) {
    super(props);
    this._version = props.version ?? 0;
  }

  get version(): number {
    return this._version;
  }

  /**
   * Records a domain event and increments the aggregate's version.
   * @param event - The domain event to record.
   */
  protected recordEvent(event: DomainEvent): void {
    this.validateEvent(event);
    this._domainEvents.push(event);
    this.incrementVersion();
  }

  clearEvents(): void {
    this._domainEvents = [];
  }

  getUncommittedEvents(): ReadonlyArray<DomainEvent> {
    return [...this._domainEvents] as ReadonlyArray<DomainEvent>;
  }

  protected incrementVersion(): void {
    this._version += 1;
  }

  abstract validate(): void;

  private validateEvent(event: DomainEvent): void {
    if (!(event instanceof DomainEvent)) {
      throw new InvalidDomainEventError(event);
    }
  }
}
