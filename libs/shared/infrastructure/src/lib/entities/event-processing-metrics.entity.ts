import { BaseEntity, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('event_processing_metrics')
@Index('idx_metrics_tenant_date', ['tenantId', 'dateHour'])
export class EventProcessingMetricsEntityORM extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', nullable: true, name: 'tenant_id' })
  tenantId?: string;

  @Column({ type: 'varchar', length: 100, name: 'event_type' })
  eventType!: string;

  @Column({ type: 'varchar', length: 20, name: 'event_source' })
  eventSource!: 'inbox' | 'outbox';

  @Column({ type: 'timestamp', name: 'date_hour' })
  dateHour!: Date; // Truncated to hour for aggregation

  @Column({ type: 'int', default: 0, name: 'total_events' })
  totalEvents!: number;

  @Column({ type: 'int', default: 0, name: 'processed_events' })
  processedEvents!: number;

  @Column({ type: 'int', default: 0, name: 'failed_events' })
  failedEvents!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, name: 'avg_processing_time_ms' })
  avgProcessingTimeMs?: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
