import { Entity, Column, OneToMany } from 'typeorm';
import { UserRole } from './user-role.entity';
import { UserPermission } from './user-permission.entity';
import { Trail } from '../audit/trail.entity';
import { AbstractTableEntity } from '@core/entities/abstract.entity';

@Entity()
export class User extends AbstractTableEntity<User> {
  @Column({ length: 32 })
  name: string;

  @Column({ length: 32, unique: true, nullable: false })
  username: string;

  @Column({ length: 32, unique: true, nullable: false })
  email: string;

  @Column({ length: 128 })
  password: string;

  @OneToMany(() => UserRole, (userRole) => userRole.user)
  userRoles?: UserRole[];

  @OneToMany(() => UserPermission, (userPermission) => userPermission.user)
  userPermissions?: UserPermission[];

  @OneToMany(() => Trail, (auditLogs) => auditLogs.user)
  trails?: Trail[];
}
