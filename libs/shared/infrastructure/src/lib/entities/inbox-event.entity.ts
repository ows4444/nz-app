import { Column, Entity, Index } from 'typeorm';
import { BaseEvent } from './base-event';

@Entity('inbox_events')
@Index('idx_inbox_processing', ['status', 'availableAt', 'priority'])
@Index('idx_inbox_tenant_type', ['targetTenantId', 'eventType'])
@Index('idx_inbox_deduplication', ['messageId', 'targetTenantId'])
export class InboxEventEntityORM extends BaseEvent {
  @Column({ type: 'timestamp', name: 'received_at', default: () => 'CURRENT_TIMESTAMP' })
  receivedAt!: Date;

  @Column({ type: 'uuid', nullable: true, name: 'original_event_id' })
  originalEventId?: string;
}
