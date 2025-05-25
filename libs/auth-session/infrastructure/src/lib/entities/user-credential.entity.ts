import { WithCreated, WithUpdated } from '@nz/shared-infrastructure';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

class UserCredential extends BaseEntity {
  @PrimaryColumn({ type: 'uuid', length: 36 })
  userId!: string;

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
export class UserCredentialEntityORM extends WithUpdated(WithCreated(UserCredential)) {}
