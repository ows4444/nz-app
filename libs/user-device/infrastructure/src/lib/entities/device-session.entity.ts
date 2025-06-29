import { BaseEntity, Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

class DeviceSession extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'session_id' })
  id!: string;

  @Column({ type: 'uuid', name: 'device_id' })
  deviceId!: string;

  @Column({ type: 'uuid', name: 'user_id' })
  userId!: string;

  @Column({ type: 'uuid', nullable: true, name: 'tenant_id' })
  tenantId?: string;

  @Column({ type: 'boolean', default: true, name: 'active_flag' })
  activeFlag!: boolean;

  @Column({ type: 'varchar', length: 45, name: 'ip_address' })
  ipAddress!: string;

  @Column({ type: 'timestamp', name: 'started_at' })
  startedAt!: Date;

  @Column({ type: 'timestamp', name: 'last_seen_at' })
  lastSeenAt!: Date;

  @Column({ type: 'varchar', length: 256, name: 'geo_location' })
  geoLocation!: string;

  @Column({ type: 'varchar', length: 256 })
  city!: string;

  @Column({ type: 'varchar', length: 256, name: 'country' })
  country!: string;

  @Column({ type: 'int', name: 'session_duration_minutes', default: 0 })
  sessionDurationMinutes!: number;
}

@Index('IDX_DEVICE_USER', ['deviceId', 'userId'])
@Index('IDX_USER_ACTIVE', ['userId', 'activeFlag'])
@Entity({ name: 'device_sessions' })
export class DeviceSessionEntityORM extends DeviceSession {}
