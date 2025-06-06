import { BaseEntity, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('dead_letter_events')
@Index('idx_dead_letter_tenant', ['sourceTenantId', 'targetTenantId', 'createdAt'])
@Index('idx_dead_letter_event_type', ['eventType', 'eventSource'])
@Index('idx_dead_letter_correlation', ['correlationId', 'createdAt'])
@Index('idx_dead_letter_reprocess', ['reprocessed', 'eventSource'])
export class DeadLetterEventEntityORM extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', name: 'original_event_id' })
  originalEventId!: string;

  @Column({ type: 'varchar', length: 20, name: 'event_source' })
  eventSource!: 'inbox' | 'outbox';

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'message_id' })
  @Index('idx_dead_letter_message_id')
  messageId?: string;

  @Column({ type: 'uuid', nullable: true, name: 'source_tenant_id' })
  sourceTenantId?: string;

  @Column({ type: 'uuid', nullable: true, name: 'target_tenant_id' })
  targetTenantId?: string;

  @Column({ type: 'varchar', length: 20, name: 'event_scope' })
  eventScope!: 'tenant' | 'global' | 'cross-tenant';

  @Column({ type: 'varchar', length: 100, name: 'aggregate_type' })
  aggregateType!: string;

  @Column({ type: 'uuid', name: 'aggregate_id' })
  aggregateId!: string;

  @Column({ type: 'varchar', length: 100, name: 'event_type' })
  eventType!: string;

  @Column({ type: 'varchar', length: 50, name: 'event_version' })
  eventVersion!: string;

  @Column({ type: 'jsonb', name: 'payload' })
  payload!: Record<string, unknown>;

  @Column({ type: 'varchar', length: 200, nullable: true, name: 'payload_schema_version' })
  payloadSchemaVersion?: string;

  @Column({ type: 'int', name: 'original_priority' })
  originalPriority!: number;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'correlation_id' })
  correlationId?: string;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'causation_id' })
  causationId?: string;

  @Column({ type: 'jsonb', nullable: true, name: 'metadata' })
  metadata?: Record<string, unknown>;

  @Column({ type: 'uuid', nullable: true, name: 'created_by_user_id' })
  createdByUserId?: string;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'created_by_service' })
  createdByService?: string;

  @Column({ type: 'timestamp', name: 'original_created_at' })
  originalCreatedAt!: Date;

  @Column({ type: 'timestamp', name: 'original_available_at' })
  originalAvailableAt!: Date;

  @Column({ type: 'text', name: 'failure_reason' })
  failureReason!: string;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'failure_code' })
  failureCode?: string;

  @Column({ type: 'jsonb', nullable: true, name: 'failure_details' })
  failureDetails?: Record<string, unknown>;

  @Column({ type: 'int', name: 'total_attempts' })
  totalAttempts!: number;

  @Column({ type: 'timestamp', name: 'first_failed_at' })
  firstFailedAt!: Date;

  @Column({ type: 'timestamp', name: 'last_failed_at' })
  lastFailedAt!: Date;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'last_processor_id' })
  lastProcessorId?: string;

  @Column({ type: 'boolean', default: false, name: 'reprocessed' })
  reprocessed!: boolean;

  @Column({ type: 'timestamp', nullable: true, name: 'reprocessed_at' })
  reprocessedAt?: Date;

  @Column({ type: 'uuid', nullable: true, name: 'reprocessed_event_id' })
  reprocessedEventId?: string;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'reprocessed_by' })
  reprocessedBy?: string;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'failure_category' })
  failureCategory?: string;

  @Column({ type: 'boolean', default: true, name: 'can_retry' })
  canRetry!: boolean;

  @Column({ type: 'text', nullable: true, name: 'resolution_notes' })
  resolutionNotes?: string;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'source_service' })
  sourceService?: string;

  @Column({ type: 'timestamp', nullable: true, name: 'received_at' })
  receivedAt?: Date;

  @Column({ type: 'jsonb', nullable: true, name: 'delivery_targets' })
  deliveryTargets?: Array<{
    targetService: string;
    targetTenant?: string;
    delivered: boolean;
    deliveredAt?: Date;
    attempts: number;
    lastError?: string;
  }>;

  @Column({ type: 'boolean', nullable: true, name: 'requires_ordering' })
  requiresOrdering?: boolean;

  @Column({ type: 'bigint', nullable: true, name: 'sequence_number' })
  sequenceNumber?: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
