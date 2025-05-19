import { WithCreated, WithUpdated } from '@nz/shared-infrastructure';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntityORM } from './user.entity';

class UserContact extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'enum', enum: ['email', 'phone'] })
  type!: 'email' | 'phone';

  @Column()
  value!: string;

  @Column({ default: false })
  isVerified!: boolean;

  @ManyToOne(() => UserEntityORM, (user: UserEntityORM) => user.contacts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntityORM;

  @OneToOne(() => UserEntityORM, (user: UserEntityORM) => user.primaryContact, {
    nullable: true,
    onDelete: 'SET NULL',
    eager: false,
  })
  primaryForUser?: UserEntityORM;
}

@Entity({ name: 'user_contacts' })
export class UserContactEntityORM extends WithUpdated(WithCreated(UserContact)) {}
