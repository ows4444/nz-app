import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

class DeviceTrustScore extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'score_id' })
  id!: string;

  @Column({ type: 'uuid', name: 'device_id' })
  deviceId!: string;

  @Column({ type: 'uuid', name: 'user_id' })
  userId!: string;

  @Column({ type: 'uuid', nullable: true, name: 'tenant_id' })
  tenantId?: string;

  @Column({ type: 'smallint', unsigned: true, default: 100, name: 'trust_score' })
  trustScore!: number;

  @Column({ type: 'varchar', length: 16, default: 'low', name: 'risk_level' })
  riskLevel!: 'low' | 'medium' | 'high' | 'critical';

  @Column({ type: 'varchar', length: 64, name: 'calculation_method' })
  calculationMethod!: string;

  @Column({ type: 'text', name: 'contributing_factors_json' })
  contributingFactorsJson!: string;

  @Column({ type: 'timestamp', name: 'last_calculated_at' })
  lastCalculatedAt!: Date;

  @Column({ type: 'timestamp', name: 'expires_at' })
  expiresAt!: Date;

  @CreateDateColumn({ type: 'timestamp', precision: 6, default: (): string => 'CURRENT_TIMESTAMP(6)', name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp', precision: 6, default: (): string => 'CURRENT_TIMESTAMP(6)', name: 'updated_at' })
  updatedAt!: Date;
}

@Entity({ name: 'device_trust_scores' })
export class DeviceTrustScoreEntityORM extends DeviceTrustScore {}
