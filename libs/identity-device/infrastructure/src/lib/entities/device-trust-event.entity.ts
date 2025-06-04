import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

class DeviceTrustEvent extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'event_id' })
  id!: string;

  @Column({ type: 'uuid', length: 36, name: 'device_id' })
  deviceId!: string;

  @Column({ type: 'uuid', length: 36, name: 'user_id' })
  userId!: string;

  @Column({ type: 'uuid', length: 36, nullable: true, name: 'tenant_id' })
  tenantId?: string;

  @Column({ type: 'varchar', length: 16, name: 'event_type' })
  eventType!: 'trusted' | 'untrusted' | 'blocked' | 'flagged' | 'verified';

  @Column({ type: 'varchar', length: 256 })
  reason!: string;

  @Column({ type: 'uuid', length: 36, name: 'created_by' })
  createdBy!: string;

  @Column({ type: 'json', name: 'metadata_json' })
  metadataJson!: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
  createdAt!: Date;
}

@Entity({ name: 'device_trust_events' })
export class DeviceTrustEventEntityORM extends DeviceTrustEvent {}
