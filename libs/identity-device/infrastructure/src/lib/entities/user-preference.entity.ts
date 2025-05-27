import { WithCreated, WithUpdated } from '@nz/shared-infrastructure';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

class UserPreference extends BaseEntity {
  @PrimaryColumn('uuid')
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
