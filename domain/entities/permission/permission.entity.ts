import { Entity, Column, OneToMany, BaseEntity, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../role';
import { User, UserPermission } from '../user';

export enum PermissionStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}
@Entity()
export class Permission extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ unique: true, nullable: false })
  name: string;

  @Column()
  description: string;

  @Column({ type: 'enum', enum: PermissionStatus, default: PermissionStatus.INACTIVE })
  status: PermissionStatus;

  @OneToMany(() => Role, (role) => role.permissions)
  roles?: Role[];

  @OneToMany(() => User, (user) => user.userPermissions)
  users?: User[];

  @OneToMany(() => UserPermission, (userPermission) => userPermission.user)
  userPermissions?: UserPermission[];
}
