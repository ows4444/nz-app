import { BaseEntity, Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Permission } from '../permission';

export enum UserPermissionStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Entity()
@Index(['user', 'permission'], { unique: true })
export class UserPermission extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'enum', enum: UserPermissionStatus, default: UserPermissionStatus.INACTIVE })
  status: UserPermissionStatus;

  @ManyToOne(() => User, (user) => user.userPermissions)
  user: User;

  @ManyToOne(() => Permission, (permission) => permission.userPermissions)
  permission: Permission;
}
