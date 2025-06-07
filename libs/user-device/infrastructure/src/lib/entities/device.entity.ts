import { BaseEntity, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

class Device extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'device_id' })
  id!: string;

  @Column({ type: 'varchar', nullable: true, name: 'device_fingerprint' })
  deviceFingerprint!: string;

  @Column({ type: 'varchar', length: 64, nullable: false, name: 'device_name' })
  deviceName!: string;

  @Column({ type: 'varchar', length: 32, nullable: false, name: 'device_type' })
  deviceType!: string;

  @Column({ type: 'varchar', length: 32, nullable: false, name: 'os_name' })
  osName!: string;

  @Column({ type: 'varchar', length: 32, nullable: false, name: 'os_version' })
  osVersion!: string;

  @Column({ type: 'varchar', length: 32, nullable: false, name: 'browser_name' })
  browserName!: string;

  @Column({ type: 'varchar', length: 32, nullable: false, name: 'browser_version' })
  browserVersion!: string;

  @Column({ type: 'varchar', length: 256, nullable: true, name: 'device_info' })
  deviceInfo!: string;

  @Column({ type: 'bigint', unsigned: true })
  status!: number;

  @Column({ type: 'smallint', unsigned: true, default: 100, name: 'trust_score' })
  trustScore!: number;

  @Column({ type: 'varchar', length: 16, default: 'low', name: 'risk_level' })
  riskLevel!: 'low' | 'medium' | 'high' | 'critical';

  @Column({ type: 'boolean', default: false, name: 'is_trusted' })
  isTrusted!: boolean;

  @Column({ type: 'timestamp', nullable: true, name: 'first_seen_at' })
  firstSeenAt!: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'last_seen_at' })
  lastSeenAt!: Date;

  @CreateDateColumn({ type: 'timestamp', precision: 6, default: (): string => 'CURRENT_TIMESTAMP(6)', name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp', precision: 6, default: (): string => 'CURRENT_TIMESTAMP(6)', name: 'updated_at' })
  updatedAt!: Date;
}

@Index('IDX_DEVICE_FINGERPRINT', ['deviceFingerprint'])
@Entity({ name: 'devices' })
export class DeviceEntityORM extends Device {}
