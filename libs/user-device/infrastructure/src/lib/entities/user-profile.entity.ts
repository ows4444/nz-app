import { StringColumn } from '@nz/shared-infrastructure';
import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UserContactEntityORM } from './user-contact.entity';

class UserProfile extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'user_id' })
  id!: string;

  @Column({ type: 'uuid', nullable: true, name: 'tenant_id' })
  tenantId?: string;

  @StringColumn({ length: 32, nullable: false, trim: true, name: 'first_name' })
  firstName!: string;

  @StringColumn({ length: 32, nullable: false, trim: true, name: 'last_name' })
  lastName!: string;

  @StringColumn({ length: 64, nullable: false, trim: true, unique: true, name: 'display_name' })
  displayName!: string;

  @StringColumn({ length: 64, nullable: false, trim: true, unique: true })
  locale!: string;

  @StringColumn({ length: 32, nullable: false, trim: true })
  timezone!: string;

  @StringColumn({ length: 256, nullable: false, trim: true, name: 'avatar_url' })
  avatarUrl!: string;

  @StringColumn({ length: 256, nullable: true, trim: true })
  bio!: string;

  @Column({ type: 'bigint', unsigned: true })
  status!: number;

  @StringColumn({ length: 32, nullable: false, trim: true, name: 'profile_visibility' })
  profileVisibility!: string;

  @Column({ type: 'timestamp', nullable: true, name: 'last_login_at' })
  lastLoginAt!: Date;

  @CreateDateColumn({ type: 'timestamp', precision: 6, default: (): string => 'CURRENT_TIMESTAMP(6)', name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp', precision: 6, default: (): string => 'CURRENT_TIMESTAMP(6)', name: 'updated_at' })
  updatedAt!: Date;
}

@Entity({ name: 'users_profile' })
export class UserProfileEntityORM extends UserProfile {
  @OneToMany(() => UserContactEntityORM, (contact: UserContactEntityORM) => contact.user)
  contacts?: UserContactEntityORM[];
}
