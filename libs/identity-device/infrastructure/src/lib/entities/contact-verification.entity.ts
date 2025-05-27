import { WithCreated, WithExpiration, WithRequested, WithUpdated, WithUsed } from '@nz/shared-infrastructure';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

class ContactVerification extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id!: number;

  @Column({ type: 'uuid', length: 36 })
  contactId!: string;

  @Column()
  purpose!: string;

  @Column()
  tokenHash!: string;

  @Column()
  code!: string;

  @Column()
  ipAddress!: string;

  @Column()
  userAgent!: string;

  @Column({ type: 'boolean', default: false })
  usedFlag!: boolean;
}

@Entity({ name: 'contact_verifications' })
export class ContactVerificationEntityORM extends WithRequested(WithUsed(WithExpiration(WithUpdated(WithCreated(ContactVerification))))) {}
