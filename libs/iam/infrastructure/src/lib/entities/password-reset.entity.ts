import { WithExpiration } from '@nz/shared-infrastructure';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserProfileEntityORM } from './user-profile.entity';

class PasswordReset extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id!: number;

  @Column()
  token!: string;
}

@Entity({ name: 'password_resets' })
export class PasswordResetEntityORM extends WithExpiration(PasswordReset) {
  @ManyToOne(() => UserProfileEntityORM, (user: UserProfileEntityORM) => user.passwordResets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: UserProfileEntityORM;
}
