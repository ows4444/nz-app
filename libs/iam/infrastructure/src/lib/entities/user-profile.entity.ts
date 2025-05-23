import { StringColumn, WithCreated, WithRevocation, WithSoftDelete, WithUpdated } from '@nz/shared-infrastructure';
import { BaseEntity, Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserContactEntityORM } from './user-contact.entity';
import { UserCredentialEntityORM } from './user-credential.entity';

class UserProfile extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @StringColumn({ length: 32, nullable: false, lowercase: true, trim: true, unique: true })
  username!: string;

  @StringColumn({ length: 32, nullable: false, lowercase: true, trim: true })
  firstName!: string;

  @StringColumn({ length: 32, nullable: false, lowercase: true, trim: true })
  lastName!: string;

  @StringColumn({ length: 32, nullable: false, lowercase: true, trim: true })
  displayName!: string;

  @StringColumn({ length: 32, nullable: false, lowercase: true, trim: true })
  avatar!: string;

  @StringColumn({ length: 32, nullable: false, lowercase: true, trim: true, unique: true })
  email!: string;

  @StringColumn({ length: 32, nullable: false, lowercase: true, trim: true })
  locale!: string;

  @Column({ type: 'bigint', unsigned: true })
  status!: number;
}

@Entity({ name: 'users_profile' })
export class UserProfileEntityORM extends WithSoftDelete(WithUpdated(WithCreated(WithRevocation(UserProfile)))) {
  @OneToMany(() => UserContactEntityORM, (contact: UserContactEntityORM) => contact.user)
  contacts?: UserContactEntityORM[];

  @OneToMany(() => UserCredentialEntityORM, (cred: UserCredentialEntityORM) => cred.user)
  passwordResets?: UserCredentialEntityORM[];

  @OneToOne(() => UserCredentialEntityORM, (cred: UserCredentialEntityORM) => cred.user)
  credentials?: UserCredentialEntityORM;
}
