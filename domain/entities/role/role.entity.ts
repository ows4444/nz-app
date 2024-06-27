import { Entity, Column, ManyToMany } from 'typeorm';

import { UserRole } from '../user/user-role.entity';
import { AbstractTableEntity } from '@core/entities';
import { Permission } from '../permission';

@Entity()
export class Role extends AbstractTableEntity<Role> {
  @Column({ unique: true, nullable: false })
  name: string;

  @Column()
  description: string;

  @ManyToMany(() => UserRole, (userRole) => userRole.role)
  userRoles: UserRole[];

  @ManyToMany(() => Permission, (permission) => permission.roles)
  permissions: Permission[];
}
