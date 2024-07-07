import { BaseEntity, Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Role } from './role.entity';
import { Permission } from '../permission';

export enum RolePermissionStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Entity()
@Index(['role', 'permission'], { unique: true })
export class RolePermission extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'enum', enum: RolePermissionStatus, default: RolePermissionStatus.INACTIVE })
  status: RolePermissionStatus;

  @ManyToOne(() => Role, (role) => role.permissions)
  role: Role;

  @ManyToOne(() => Permission, (permission) => permission.roles)
  permission: Permission;
}
