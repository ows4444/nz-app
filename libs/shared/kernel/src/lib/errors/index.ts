export abstract class DomainError extends Error {
  constructor(message: string, public readonly code?: string, public readonly metadata?: Record<string, unknown>) {
    super(message);
  }
}
export class InvalidDomainEventError extends DomainError {
  constructor(event: unknown) {
    super(`Invalid domain event type: ${typeof event}`);
  }
}

export class InvalidAggregateVersionError extends DomainError {
  constructor(expected: number, actual: number) {
    super(`Aggregate version mismatch. Expected ${expected}, got ${actual}`);
  }
}

// Concrete error
export class ConflictError extends DomainError {
  constructor(resource: string, id: string) {
    super(`${resource} ${id} already exists`, 'CONFLICT', { resource, id });
  }
}
