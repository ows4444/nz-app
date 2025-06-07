import { BaseEntity, Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntityORM } from './user.entity';

class UserPasswordHistory extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true, name: 'history_id' })
  id!: number;

  @Column({ type: 'uuid', name: 'user_id' })
  userId!: string;

  @Column({ name: 'password_hash' })
  passwordHash!: string;

  @Column()
  salt!: string;

  @Column({ name: 'hash_algo' })
  hashAlgo!: string;

  @Column({ name: 'pepper_version' })
  pepperVersion!: string;

  @Column({ type: 'timestamp', precision: 6, default: (): string => 'CURRENT_TIMESTAMP(6)', name: 'changed_at' })
  changedAt!: Date;
}

@Index('IDX_USER_CHANGED', ['userId', 'changedAt'])
@Entity({ name: 'user_password_history' })
export class UserPasswordHistoryEntityORM extends UserPasswordHistory {
  @ManyToOne(() => UserEntityORM, (user: UserEntityORM) => user.passwordHistory, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntityORM;
}
