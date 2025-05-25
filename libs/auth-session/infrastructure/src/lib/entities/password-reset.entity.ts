import { WithExpiration } from '@nz/shared-infrastructure';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

class PasswordReset extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id!: number;

  @Column()
  token!: string;

  @Column({ type: 'uuid', length: 36 })
  userId!: string;
}

@Entity({ name: 'password_resets' })
export class PasswordResetEntityORM extends WithExpiration(PasswordReset) {}
