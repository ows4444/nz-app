import { StringColumn, WithCreated, WithUpdated } from '@nz/shared-infrastructure';
import { BaseEntity, Column, Entity, Index, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserContactEntityORM } from './user-contact.entity';

class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @StringColumn({ length: 32, nullable: false, lowercase: true, trim: true, unique: true })
  username!: string;

  @StringColumn({ length: 32, nullable: false, lowercase: true, trim: true, unique: true })
  email!: string;

  @Column({ type: 'uuid', name: 'primary_contact_id', nullable: true })
  @Index()
  primaryContactId!: string | null;

  @OneToMany(() => UserContactEntityORM, (contact) => contact.user)
  contacts!: UserContactEntityORM[];

  @OneToOne(() => UserContactEntityORM, (contact: UserContactEntityORM) => contact.primaryForUser, {
    nullable: true,
    onDelete: 'SET NULL',
    cascade: ['insert', 'update'],
    eager: false,
  })
  @JoinColumn({ name: 'primary_contact_id' })
  primaryContact!: UserContactEntityORM | null;
}

@Entity({ name: 'users' })
export class UserEntityORM extends WithUpdated(WithCreated(User)) {}
