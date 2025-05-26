import { WithCreated } from '@nz/shared-infrastructure';
import { BaseEntity, Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

class UserPasswordHistory extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @PrimaryColumn({ type: 'uuid', length: 36 })
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

@Entity({ name: 'user_credentials' })
export class UserPasswordHistoryEntityORM extends WithCreated(UserPasswordHistory) {}
