import { Entity, Index, ManyToOne } from 'typeorm';

import { AbstractTableEntity } from '@core/entities';
import { Role } from './role.entity';
import { Permission } from '../permission';

@Entity()
@Index(['role', 'permission'], { unique: true })
export class RolePermission extends AbstractTableEntity<RolePermission> {
  @ManyToOne(() => Role, (role) => role.permissions)
  role: Role;

  @ManyToOne(() => Permission, (permission) => permission.roles)
  permission: Permission;
}
