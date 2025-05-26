import { WithCreated, WithUpdated } from '@nz/shared-infrastructure';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

class UserPreference extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  userId!: string;

  @Column()
  key!: string;

  @Column()
  value!: string;

  @Column()
  source!: string;
}

@Entity({ name: 'user_preferences' })
export class UserPreferenceEntityORM extends WithUpdated(WithCreated(UserPreference)) {}
