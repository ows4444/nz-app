import { WithCreated, WithUpdated } from '@nz/shared-infrastructure';
import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { UserProfileEntityORM } from './user-profile.entity';

class UserCredential extends BaseEntity {
  @PrimaryColumn({ type: 'uuid', length: 36 })
  id!: string;

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
export class UserCredentialEntityORM extends WithUpdated(WithCreated(UserCredential)) {
  @OneToOne(() => UserProfileEntityORM, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id' })
  user!: UserProfileEntityORM;
}
