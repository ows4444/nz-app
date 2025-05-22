import { StringColumn, WithCreated } from '@nz/shared-infrastructure';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserProfileEntityORM } from './user-profile.entity';

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
}

@Entity({ name: 'login_attempts' })
export class LoginAttemptEntityORM extends WithCreated(LoginAttempt) {
  @ManyToOne(() => UserProfileEntityORM, (user: UserProfileEntityORM) => user.contacts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: UserProfileEntityORM;
}
