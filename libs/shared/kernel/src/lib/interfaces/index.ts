export interface BaseEntityProps<T extends string | number> {
  id: T;
}

export type AggregateID = string | number;

export interface BaseAggregateProps<T> {
  id: T;
  version?: number;
}

export interface DomainEventMetadata {
  correlationId?: string;
  causationId?: string;
  timestamp?: Date;
}
