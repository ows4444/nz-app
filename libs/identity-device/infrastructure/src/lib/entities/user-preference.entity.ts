import { WithCreated, WithUpdated } from '@nz/shared-infrastructure';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

class UserPreference extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'preference_id' })
  id!: string;

  @Column({ type: 'uuid', length: 36, nullable: false, name: 'user_id' })
  userId!: string;

  @Column({ type: 'uuid', length: 36, nullable: true, name: 'tenant_id' })
  tenantId?: string;

  @Column({ type: 'varchar', length: 64, nullable: false })
  category!: string;

  @Column({ type: 'varchar', length: 64, nullable: false, name: 'preference_key' })
  preferenceKey!: string;

  @Column({ type: 'varchar', length: 256, nullable: false, name: 'preference_value' })
  preferenceValue!: string;

  @Column({ type: 'varchar', length: 32, nullable: false, name: 'data_type' })
  dataType!: string;

  @Column({ type: 'boolean', default: false, name: 'is_encrypted' })
  isEncrypted!: boolean;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'updated_at' })
  updatedAt!: Date;
}

@Entity({ name: 'user_preferences' })
export class UserPreferenceEntityORM extends WithUpdated(WithCreated(UserPreference)) {}
