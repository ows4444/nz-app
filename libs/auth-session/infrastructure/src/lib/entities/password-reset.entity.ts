import { WithExpiration } from '@nz/shared-infrastructure';
import { BaseEntity, Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntityORM } from './user.entity';

class PasswordReset extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true, name: 'reset_id' })
  id!: number;

  @Column({ type: 'uuid', length: 36, name: 'user_id' })
  userId!: string;

  @Column({ type: 'varchar', length: 255, name: 'token_hash' })
  tokenHash!: string;

  @Column({ type: 'varchar', length: 45, name: 'token_type' })
  tokenType!: string;

  @Column({ type: 'timestamp', name: 'expires_at' })
  expiresAt!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'requested_at' })
  requestedAt!: Date;

  @Column({ type: 'varchar', length: 45, name: 'ip_address' })
  ipAddress!: string;

  @Column({ type: 'varchar', length: 255, name: 'user_agent' })
  userAgent!: string;

  @Column({ type: 'boolean', default: false, name: 'used_flag' })
  usedFlag!: boolean;

  @Column({ type: 'timestamp', nullable: true, name: 'used_at' })
  usedAt?: Date;

  @Column({ type: 'int', default: 0, name: 'attempts_count' })
  attemptsCount!: number;
}

@Index('IDX_TOKEN_HASH', ['tokenHash'])
@Index('IDX_USER_EXPIRES', ['userId', 'expiresAt'])
@Entity({ name: 'password_resets' })
export class PasswordResetEntityORM extends WithExpiration(PasswordReset) {
  @ManyToOne(() => UserEntityORM, (user: UserEntityORM) => user.passwordResets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntityORM;
}
