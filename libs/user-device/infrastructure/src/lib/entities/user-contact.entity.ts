import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UserProfileEntityORM } from './user-profile.entity';

class UserContact extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'contact_id' })
  id!: string;

  @Column({ type: 'uuid', length: 36, name: 'user_id' })
  userId!: string;

  @Column({ type: 'uuid', length: 36, nullable: true, name: 'tenant_id' })
  tenantId?: string;

  @Column({ type: 'enum', enum: ['email', 'phone'] })
  type!: 'email' | 'phone';

  @Column({ type: 'varchar', length: 256, nullable: false, name: 'contact_label' })
  label!: string;

  @Column({ type: 'varchar', length: 256, nullable: false, name: 'contact_value' })
  value!: string;

  @Column({ type: 'boolean', default: false, name: 'verified_flag' })
  verifiedFlag!: boolean;

  @Column({ type: 'timestamp', nullable: true, name: 'verified_at' })
  verifiedAt!: Date;

  @Column({ type: 'boolean', default: false, name: 'is_primary' })
  isPrimary!: boolean;

  @Column({ type: 'varchar', length: 8, nullable: true, name: 'country_code' })
  countryCode!: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'updated_at' })
  updatedAt!: Date;
}

@Entity({ name: 'user_contacts' })
export class UserContactEntityORM extends UserContact {
  @ManyToOne(() => UserProfileEntityORM, (user: UserProfileEntityORM) => user.contacts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: UserProfileEntityORM;
}
