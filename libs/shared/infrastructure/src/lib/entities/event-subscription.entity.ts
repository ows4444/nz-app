import { BaseEntity, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('event_subscriptions')
@Index('idx_subscription_tenant_event', ['tenantId', 'eventType'])
@Index('idx_subscription_active', ['isActive', 'eventScope'])
export class EventSubscriptionEntityORM extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'subscription_id' })
  id!: string;

  @Column({ type: 'uuid', nullable: true, name: 'tenant_id' })
  tenantId?: string; // null for global subscriptions

  @Column({ type: 'varchar', length: 100, name: 'event_type' })
  eventType!: string;

  @Column({ type: 'varchar', length: 20, name: 'event_scope' })
  eventScope!: 'tenant' | 'global' | 'cross-tenant';

  @Column({ type: 'varchar', length: 100, name: 'subscriber_service' })
  subscriberService!: string;

  @Column({ type: 'varchar', length: 200, nullable: true, name: 'filter_expression' })
  filterExpression?: string;  

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive!: boolean;

  @Column({ type: 'int', default: 5 })
  priority!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
