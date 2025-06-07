import { StringColumn } from '@nz/shared-infrastructure';
import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { PasswordResetEntityORM } from './password-reset.entity';
import { UserCredentialEntityORM } from './user-credential.entity';
import { UserPasswordHistoryEntityORM } from './user-password-history.entity';

class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'user_id' })
  id!: string;

  @StringColumn({ length: 32, nullable: false, lowercase: true, trim: true, unique: true })
  username!: string;

  @StringColumn({ length: 32, nullable: false, lowercase: true, trim: true, unique: true })
  email!: string;

  @StringColumn({ length: 32, nullable: false, trim: true, name: 'first_name' })
  firstName!: string;

  @StringColumn({ length: 32, nullable: false, trim: true, name: 'last_name' })
  lastName!: string;

  @StringColumn({ length: 32, nullable: false, trim: true, name: 'display_name' })
  displayName!: string;

  @StringColumn({ length: 32, nullable: false, trim: true, name: 'avatar_url' })
  avatarUrl!: string;

  @StringColumn({ length: 32, nullable: false, trim: true })
  locale!: string;

  @StringColumn({ length: 32, nullable: false, trim: true })
  timezone!: string;

  @Column({ type: 'bigint', unsigned: true })
  status!: number;

  @Column({ type: 'boolean', default: false, name: 'mfa_enabled' })
  mfaEnabled!: boolean;

  @Column({ type: 'timestamp', nullable: true, name: 'email_verified_at' })
  emailVerifiedAt!: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'phone_verified_at' })
  phoneVerifiedAt!: Date;

  @CreateDateColumn({ type: 'timestamp', precision: 6, default: (): string => 'CURRENT_TIMESTAMP(6)', name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp', precision: 6, default: (): string => 'CURRENT_TIMESTAMP(6)', name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true, name: 'deleted_at' })
  deletedAt!: Date;
}

@Entity({ name: 'users' })
export class UserEntityORM extends User {
  @OneToOne(() => UserCredentialEntityORM, (credential: UserCredentialEntityORM) => credential.user)
  credential!: UserCredentialEntityORM;

  @OneToMany(() => UserPasswordHistoryEntityORM, (history: UserPasswordHistoryEntityORM) => history.user)
  passwordHistory!: UserPasswordHistoryEntityORM[];

  @OneToMany(() => PasswordResetEntityORM, (reset: PasswordResetEntityORM) => reset.user)
  passwordResets!: PasswordResetEntityORM[];
}
