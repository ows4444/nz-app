import { BaseEntity, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('event_routing_rules')
@Index('idx_routing_tenant_type', ['sourceTenantId', 'eventType'])
export class EventRoutingRuleEntityORM extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100, name: 'rule_name' })
  ruleName!: string;

  @Column({ type: 'uuid', nullable: true, name: 'source_tenant_id' })
  sourceTenantId?: string;

  @Column({ type: 'varchar', length: 100, name: 'event_type' })
  eventType!: string;

  @Column({ type: 'text', name: 'routing_condition' })
  routingCondition!: string; // JSON logic or expression

  @Column({ type: 'jsonb', name: 'target_tenants' })
  targetTenants!: string[]; // Array of tenant IDs

  @Column({ type: 'varchar', length: 20, name: 'routing_type' })
  routingType!: 'broadcast' | 'selective' | 'conditional';

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive!: boolean;

  @Column({ type: 'int', default: 1 })
  priority!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
