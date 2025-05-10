import { Status } from '@nz/const';
import { StringColumn, WithCreated, WithRevocation, WithSoftDelete, WithUpdated } from '@nz/shared-infrastructure';

import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

class UserAccount extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @StringColumn({ length: 32, nullable: false, lowercase: true, trim: true, unique: true })
  email!: string;

  @StringColumn({ length: 32, nullable: false, lowercase: true, trim: true, unique: true })
  username!: string;

  @Column()
  passwordHash!: string;

  @Column({ default: false })
  emailVerified!: boolean;

  @Column({ type: 'int' })
  status!: Status;
}

@Entity({ name: 'user_accounts' })
export class UserAccountEntityORM extends WithSoftDelete(WithUpdated(WithCreated(WithRevocation(UserAccount)))) {}
