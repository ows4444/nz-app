import { StringColumn } from '@nz/shared-infrastructure';
import { BaseEntity, Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

class LoginAttempt extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true, name: 'attempt_id' })
  id!: number;

  @Column({ type: 'uuid', length: 36, name: 'user_id' })
  userId!: string;

  @Column({ type: 'uuid', length: 36, nullable: true, name: 'tenant_id' })
  tenantId?: string;

  @StringColumn({ length: 256, nullable: true, lowercase: true, trim: true, name: 'email_attempted' })
  emailAttempted?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp!: Date;

  @Column({ type: 'boolean', default: false, name: 'success_flag' })
  successFlag!: boolean;

  @StringColumn({ length: 256, nullable: true, trim: true, name: 'failure_reason' })
  failureReason?: string;

  @StringColumn({ length: 256, nullable: true, trim: true, name: 'ip_address' })
  ipAddress!: string;

  @StringColumn({ length: 256, nullable: true, trim: true, name: 'user_agent' })
  userAgent!: string;

  @Column({ type: 'smallint', unsigned: true, default: 0, name: 'risk_score' })
  riskScore!: number;

  @StringColumn({ length: 512, nullable: true, trim: true, name: 'location_data' })
  locationData?: string;

  @StringColumn({ length: 512, nullable: true, trim: true, name: 'device_fingerprint' })
  deviceFingerprint?: string;
}

@Index('IDX_LOGIN_ATTEMPT_USER_ID_TIMESTAMP', ['userId', 'timestamp'])
@Index('IDX_LOGIN_ATTEMPT_IP_ADDRESS_TIMESTAMP', ['ipAddress', 'timestamp'])
@Entity({ name: 'login_attempts' })
export class LoginAttemptEntityORM extends LoginAttempt {}
