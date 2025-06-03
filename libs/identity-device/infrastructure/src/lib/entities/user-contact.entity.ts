import { WithCreated, WithUpdated } from '@nz/shared-infrastructure';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserProfileEntityORM } from './user-profile.entity';

class UserContact extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id!: number;

  @Column({ type: 'enum', enum: ['email', 'phone'] })
  type!: 'email' | 'phone';

  @Column()
  value!: string;

  @Column({ default: false })
  isVerified!: boolean;

  @Column({ default: false })
  isDefault!: boolean;
}

@Entity({ name: 'user_contacts' })
export class UserContactEntityORM extends WithUpdated(WithCreated(UserContact)) {
  @ManyToOne(() => UserProfileEntityORM, (user: UserProfileEntityORM) => user.contacts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: UserProfileEntityORM;
}
