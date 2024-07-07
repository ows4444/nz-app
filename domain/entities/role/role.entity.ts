import { Entity, Column, ManyToMany, BaseEntity, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from '../user/user-role.entity';
import { Permission } from '../permission';

export enum RoleStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Entity()
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ unique: true, nullable: false })
  name: string;

  @Column()
  description: string;

  @Column({ type: 'enum', enum: RoleStatus, default: RoleStatus.INACTIVE })
  status: RoleStatus;

  @ManyToMany(() => UserRole, (userRole) => userRole.role)
  userRoles: UserRole[];

  @ManyToMany(() => Permission, (permission) => permission.roles)
  permissions: Permission[];
}
