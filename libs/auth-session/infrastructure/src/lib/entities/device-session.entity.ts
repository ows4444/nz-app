import { StringColumn, WithCreated } from '@nz/shared-infrastructure';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

class DeviceSession extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  sessionId!: string;

  @Column({ type: 'uuid', length: 36, unique: true })
  deviceId!: string;

  @Column({ type: 'uuid', length: 36 })
  userId!: string;

  @StringColumn({ length: 256, nullable: false, lowercase: true, trim: true })
  ipAddress!: string;

  @StringColumn({ length: 256, nullable: false, lowercase: true, trim: true })
  geoLocation!: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  startedAt!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  lastSeenAt!: Date;

  @Column({ type: 'boolean', default: true })
  activeFlag!: boolean;
}

@Entity({ name: 'device_sessions' })
export class DeviceSessionEntityORM extends WithCreated(DeviceSession) {}
