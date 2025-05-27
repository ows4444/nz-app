import { WithCreated } from '@nz/shared-infrastructure';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

class UserPasswordHistory extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id!: number;

  @Column({ type: 'uuid', length: 36 })
  userId!: string;

  @Column()
  passwordHash!: string;

  @Column()
  salt!: string;

  @Column()
  algo!: string;

  @Column()
  pepperVersion!: string;
}

@Entity({ name: 'user_password_history' })
export class UserPasswordHistoryEntityORM extends WithCreated(UserPasswordHistory) {}
