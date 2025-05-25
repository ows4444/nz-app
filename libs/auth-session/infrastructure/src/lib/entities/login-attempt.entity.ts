import { StringColumn, WithCreated } from '@nz/shared-infrastructure';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

class LoginAttempt extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id!: number;

  @StringColumn({ length: 32, nullable: false, lowercase: true, trim: true })
  ipAddress!: string;

  @StringColumn({ length: 32, nullable: false, lowercase: true, trim: true })
  userAgent!: string;

  @Column({ type: 'boolean', default: false })
  successFlag!: boolean;

  @Column({ type: 'smallint', unsigned: true })
  riskScore!: number;

  @Column({ type: 'uuid', length: 36 })
  userId!: string;
}

@Entity({ name: 'login_attempts' })
export class LoginAttemptEntityORM extends WithCreated(LoginAttempt) {}
