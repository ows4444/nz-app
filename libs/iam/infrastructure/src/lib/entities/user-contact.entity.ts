import { WithCreated, WithUpdated } from '@nz/shared-infrastructure';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserProfileEntityORM } from './user-profile.entity';

class UserContact extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'enum', enum: ['email', 'phone'] })
  type!: 'email' | 'phone';

  @Column()
  value!: string;

  @Column({ default: false })
  isVerified!: boolean;

  @ManyToOne(() => UserProfileEntityORM, (user: UserProfileEntityORM) => user.contacts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: UserProfileEntityORM;

  @OneToOne(() => UserProfileEntityORM, (user: UserProfileEntityORM) => user.primaryContact, {
    nullable: true,
    onDelete: 'SET NULL',
    eager: false,
  })
  primaryForUser?: UserProfileEntityORM;
}

@Entity({ name: 'user_contacts' })
export class UserContactEntityORM extends WithUpdated(WithCreated(UserContact)) {}
