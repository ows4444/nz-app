import { Column, Entity, Index } from 'typeorm';
import { BaseEvent } from './base-event';

@Index('idx_outbox_processing', ['status', 'availableAt', 'priority'])
@Index('idx_outbox_tenant_type', ['sourceTenantId', 'eventType'])
@Index('idx_outbox_correlation', ['correlationId', 'createdAt'])
@Entity('outbox_events')
export class OutboxEventEntityORM extends BaseEvent {
  @Column({ type: 'jsonb', nullable: true, name: 'delivery_targets' })
  deliveryTargets!: Array<{
    targetService: string;
    targetTenant?: string;
    delivered: boolean;
    deliveredAt?: Date;
    attempts: number;
    lastError?: string;
  }>;

  @Column({ type: 'boolean', default: false, name: 'requires_ordering' })
  requiresOrdering!: boolean;

  @Column({ type: 'bigint', nullable: true, name: 'sequence_number' })
  @Index('idx_sequence_number')
  sequenceNumber?: number;
}
