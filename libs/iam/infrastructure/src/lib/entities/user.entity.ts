import { Status } from '@nz/const';
import { StringColumn, WithCreated, WithRevocation, WithSoftDelete, WithUpdated } from '@nz/shared-infrastructure';

import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @StringColumn({ length: 32, nullable: false, lowercase: true, trim: true, unique: true })
  username!: string;

  @StringColumn({ length: 32, nullable: false, lowercase: true, trim: true, unique: true })
  email!: string;

  @StringColumn({ length: 32, nullable: false, trim: true })
  phone!: string;

  @Column({ default: false })
  isEmailVerified!: boolean;

  @Column({ default: false })
  isPhoneVerified!: boolean;

  @StringColumn({ length: 32, nullable: false, trim: true })
  locale!: string;

  @Column({ type: 'int' })
  status!: Status;
}

@Entity({ name: 'users' })
export class UserEntityORM extends WithSoftDelete(WithUpdated(WithCreated(WithRevocation(User)))) {}
