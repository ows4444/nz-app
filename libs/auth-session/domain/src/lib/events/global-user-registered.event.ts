import { DeliveryTarget, IOutboxEventProps } from '@nz/shared-domain';
import { v4 as uuidv4 } from 'uuid';

export class GlobalUserCreatedEvent implements IOutboxEventProps {
  id?: string;

  messageId: string;

  correlationId?: string;

  causationId?: string;

  eventScope: 'tenant' | 'global' | 'cross-tenant' = 'global';
  aggregateType = 'User';
  aggregateId: string;
  eventType: string;
  eventVersion = '1.0';
  payloadSchemaVersion = '1.0';
  requiresOrdering = false;
  priority: number;

  payload: Record<string, unknown>;
  deliveryTargets: DeliveryTarget[];

  status: 'pending' | 'processing' | 'processed' | 'failed' | 'dead_letter' | 'retrying' = 'pending';
  processingAttempts: number;
  maxRetryAttempts: number;

  // Scheduling / expiry
  availableAt: Date;
  expiresAt: Date;

  // Auditing / tracing
  metadata: Record<string, unknown>;
  createdByUserId: string;
  createdByService: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(opts: {
    aggregateId: string;
    payload: Record<string, unknown>;
    createdByUserId: string;
    createdByService: string;
    priority?: number;
    maxRetryAttempts?: number;
    deliveryTargets?: DeliveryTarget[];
    correlationId?: string;
    causationId?: string;
    metadata?: Record<string, unknown>;
    availableAt?: Date;
    expiresAfterMs?: number;
  }) {
    // identifiers
    this.id = undefined; // to be set by your ORM/DB layer
    this.messageId = uuidv4();
    this.correlationId = opts.correlationId;
    this.causationId = opts.causationId;

    // metadata
    this.aggregateId = opts.aggregateId;
    this.eventType = this.constructor.name;
    this.priority = opts.priority ?? 0;
    this.deliveryTargets = opts.deliveryTargets ?? [];

    // payload
    this.payload = opts.payload;

    // processing / retry defaults

    this.processingAttempts = 0;
    this.maxRetryAttempts = opts.maxRetryAttempts ?? 3;

    // scheduling and expiry
    this.availableAt = opts.availableAt ?? new Date();
    const expiresMs = opts.expiresAfterMs ?? 24 * 60 * 60 * 1_000;
    this.expiresAt = new Date(Date.now() + expiresMs);

    // auditing
    this.metadata = opts.metadata ?? {};
    this.createdByUserId = opts.createdByUserId;
    this.createdByService = opts.createdByService;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
