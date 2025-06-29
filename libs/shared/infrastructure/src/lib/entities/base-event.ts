import { BaseEntity, Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseEvent extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'event_id' })
  id!: string;

  @Column({ type: 'uuid', nullable: true, name: 'source_tenant_id' })
  sourceTenantId?: string;

  @Column({ type: 'uuid', nullable: true, name: 'target_tenant_id' })
  targetTenantId?: string;

  @Column({ type: 'varchar', length: 20, name: 'event_scope', default: 'tenant' })
  eventScope!: 'tenant' | 'global' | 'cross-tenant';

  @Column({ type: 'varchar', length: 100, name: 'aggregate_type' })
  aggregateType!: string;

  @Column({ type: 'uuid', name: 'aggregate_id' })
  aggregateId!: string;

  @Column({ type: 'varchar', length: 100, name: 'event_type' })
  eventType!: string;

  @Column({ type: 'varchar', length: 50, name: 'event_version', default: '1.0' })
  eventVersion!: string;

  @Column({ type: 'jsonb' })
  payload!: Record<string, unknown>;

  @Column({ type: 'varchar', length: 200, nullable: true, name: 'payload_schema_version' })
  payloadSchemaVersion?: string;

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status!: 'pending' | 'processing' | 'processed' | 'failed' | 'dead_letter' | 'retrying';

  @Column({ type: 'int', default: 0, name: 'processing_attempts' })
  processingAttempts!: number;

  @Column({ type: 'int', default: 3, name: 'max_retry_attempts' })
  maxRetryAttempts!: number;

  @Column({ type: 'timestamp', nullable: true, name: 'last_error_at' })
  lastErrorAt?: Date;

  @Column({ type: 'text', nullable: true, name: 'last_error_message' })
  lastErrorMessage?: string;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'last_error_code' })
  lastErrorCode?: string;

  @Column({ type: 'jsonb', nullable: true, name: 'error_details' })
  errorDetails?: Record<string, unknown>;

  @Column({ type: 'int', default: 5, name: 'priority' })
  priority!: number;

  @Column({ type: 'timestamp', precision: 6, default: (): string => 'CURRENT_TIMESTAMP(6)', name: 'available_at' })
  availableAt!: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'expires_at' })
  expiresAt?: Date;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'processor_id' })
  processorId?: string;

  @Column({ type: 'timestamp', nullable: true, name: 'locked_at' })
  lockedAt?: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'processed_at' })
  processedAt?: Date;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'correlation_id' })
  correlationId?: string;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'causation_id' })
  causationId?: string;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'message_id' })
  messageId?: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, unknown>;

  @Column({ type: 'uuid', nullable: true, name: 'created_by_user_id' })
  createdByUserId?: string;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'created_by_service' })
  createdByService?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
