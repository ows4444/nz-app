import { Entity, Column, OneToMany, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';
import { UserRole } from './user-role.entity';
import { UserPermission } from './user-permission.entity';
import { Trail } from '../audit/trail.entity';

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DELETED = 'deleted',
}

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ length: 32 })
  name: string;

  @Column({ length: 32, unique: true, nullable: false })
  username: string;

  @Column({ length: 32, unique: true, nullable: false })
  email: string;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;

  @Column({ length: 128 })
  password: string;

  @OneToMany(() => UserRole, (userRole) => userRole.user)
  userRoles?: UserRole[];

  @OneToMany(() => UserPermission, (userPermission) => userPermission.user)
  userPermissions?: UserPermission[];

  @OneToMany(() => Trail, (auditLogs) => auditLogs.user)
  trails?: Trail[];
}
