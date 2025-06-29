import { Column, Entity, Index } from 'typeorm';
import { BaseEvent } from './base-event';

@Entity('dead_letter_events')
@Index('idx_dead_letter_tenant', ['sourceTenantId', 'targetTenantId', 'createdAt'])
@Index('idx_dead_letter_event_type', ['eventType', 'eventSource'])
@Index('idx_dead_letter_correlation', ['correlationId', 'createdAt'])
@Index('idx_dead_letter_reprocess', ['reprocessed', 'eventSource'])
export class DeadLetterEventEntityORM extends BaseEvent {
  @Column({ type: 'uuid', name: 'original_event_id' })
  originalEventId!: string;

  @Column({ type: 'varchar', length: 20, name: 'event_source' })
  eventSource!: 'inbox' | 'outbox';

  @Column({ type: 'int', name: 'original_priority' })
  originalPriority!: number;

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
}
