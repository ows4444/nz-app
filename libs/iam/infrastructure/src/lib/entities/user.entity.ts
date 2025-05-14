import { StringColumn, WithCreated, WithUpdated } from '@nz/shared-infrastructure';

import { BaseEntity, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserContactEntityORM } from './user-contact.entity';

class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @StringColumn({ length: 32, nullable: false, lowercase: true, trim: true, unique: true })
  username!: string;

  @StringColumn({ length: 32, nullable: false, lowercase: true, trim: true, unique: true })
  email!: string;

  // FK for the “primary” contact row
  @Column({ type: 'uuid', nullable: true })
  primary_contact_id!: string | null;

  @OneToMany(() => UserContactEntityORM, (contact) => contact.user)
  contacts!: UserContactEntityORM[];

  @OneToOne(() => UserContactEntityORM, (contact) => contact.user, { nullable: true, cascade: ['insert'] })
  @JoinColumn({ name: 'primary_contact_id' })
  primaryContact!: UserContactEntityORM;
}

@Entity({ name: 'users' })
export class UserEntityORM extends WithUpdated(WithCreated(User)) {}
