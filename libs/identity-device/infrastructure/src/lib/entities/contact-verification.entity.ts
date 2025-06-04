import { WithCreated, WithExpiration, WithRequested, WithUpdated, WithUsed } from '@nz/shared-infrastructure';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

class ContactVerification extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'verification_id' })
  id!: number;

  @Column({ type: 'uuid', length: 36, name: 'contact_id' })
  contactId!: string;

  @Column()
  purpose!: string;

  @Column({ type: 'varchar', length: 255, name: 'token_hash' })
  tokenHash!: string;

  @Column()
  code!: string;

  @Column({ type: 'enum', enum: ['sms', 'email'], name: 'delivery_method' })
  deliveryMethod!: 'sms' | 'email';

  @Column({ type: 'timestamp', name: 'expires_at' })
  expiresAt!: Date;

  @Column({ type: 'boolean', default: false, name: 'used_flag' })
  usedFlag!: boolean;

  @Column({ type: 'timestamp', name: 'used_at', nullable: true })
  usedAt?: Date;

  @Column({ type: 'int', name: 'attempts_count', default: 0 })
  attemptsCount!: number;

  @Column({ type: 'int', name: 'max_attempts' })
  maxAttempts!: number;

  @Column({ type: 'timestamp', name: 'requested_at' })
  requestedAt!: Date;

  @Column({ type: 'varchar', length: 255, name: 'ip_address' })
  ipAddress!: string;

  @Column({ type: 'varchar', length: 255, name: 'user_agent' })
  userAgent!: string;
}

@Entity({ name: 'contact_verifications' })
export class ContactVerificationEntityORM extends WithRequested(WithUsed(WithExpiration(WithUpdated(WithCreated(ContactVerification))))) {}
