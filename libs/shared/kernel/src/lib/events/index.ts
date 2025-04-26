import { randomUUID } from 'crypto';
import { AggregateID } from '../interfaces';

export abstract class DomainEvent {
  public readonly eventId: string;
  public readonly occurredOn: Date;

  constructor(public readonly aggregateId: AggregateID, eventId?: string, occurredOn?: Date) {
    this.eventId = eventId ?? randomUUID();
    this.occurredOn = occurredOn ?? new Date();
  }
}
