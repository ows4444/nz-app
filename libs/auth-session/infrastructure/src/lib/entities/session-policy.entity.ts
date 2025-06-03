import { BaseEntity, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

class SessionPolicy extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'policy_id' })
  id!: string;

  @Column({ type: 'uuid', length: 36, name: 'tenant_id' })
  tenantId!: string;

  @Column({ type: 'int', unsigned: true, name: 'max_concurrent_sessions' })
  maxConcurrentSessions!: number;

  @Column({ type: 'int', unsigned: true, name: 'inactivity_timeout_minutes' })
  inactivityTimeoutMinutes!: number;

  @Column({ type: 'int', unsigned: true, name: 'absolute_timeout_hours' })
  absoluteTimeoutHours!: number;

  @Column({ type: 'boolean', name: 'require_mfa' })
  requireMFA!: boolean;

  @Column({ type: 'text', array: true, name: 'allowed_ip_ranges' })
  allowedIpRanges!: string[];

  @Column({ type: 'boolean', name: 'device_trust_required' })
  deviceTrustRequired!: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'updated_at' })
  updatedAt!: Date;
}

@Index('IDX_TENANT_MFA', ['tenantId', 'requireMFA'])
@Entity({ name: 'session_policies' })
export class SessionPolicyEntityORM extends SessionPolicy {}
