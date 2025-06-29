import { StringColumn } from '@nz/shared-infrastructure';
import { BaseEntity, Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

class UserSession extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'session_id' })
  id!: string;

  @Column({ type: 'uuid', name: 'user_id' })
  userId!: string;

  @Column({ type: 'uuid', nullable: true, name: 'tenant_id' })
  tenantId?: string;

  @StringColumn({ length: 256, nullable: false, trim: true, name: 'device_fingerprint' })
  deviceFingerprint!: string;

  @StringColumn({ length: 256, nullable: false, trim: true, name: 'session_token_hash' })
  sessionTokenHash!: string;

  @StringColumn({ length: 256, nullable: false, lowercase: true, trim: true, name: 'ip_address' })
  ipAddress!: string;

  @StringColumn({ length: 256, nullable: false, lowercase: true, trim: true, name: 'user_agent' })
  userAgent!: string;

  @Column({ type: 'timestamp', precision: 6, default: (): string => 'CURRENT_TIMESTAMP(6)', name: 'started_at' })
  startedAt!: Date;

  @Column({ type: 'timestamp', precision: 6, default: (): string => 'CURRENT_TIMESTAMP(6)', name: 'last_activity_at' })
  lastActivityAt!: Date;

  @Column({ type: 'timestamp', name: 'expires_at' })
  expiresAt!: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'terminated_at' })
  terminatedAt?: Date;

  @StringColumn({ length: 512, nullable: true, name: 'termination_reason' })
  terminationReason?: string;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive!: boolean;
}

@Index('IDX_USER_SESSION_USER_ID_IS_ACTIVE', ['userId', 'isActive'])
@Index('IDX_USER_SESSION_SESSION_TOKEN_HASH', ['sessionTokenHash'])
@Entity({ name: 'device_sessions' })
export class UserSessionEntityORM extends UserSession {}
