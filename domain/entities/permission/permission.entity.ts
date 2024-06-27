import { Entity, Column, OneToMany } from 'typeorm';
import { AbstractTableEntity } from '@core/entities';
import { Role } from '../role';
import { User, UserPermission } from '../user';

@Entity()
export class Permission extends AbstractTableEntity<Permission> {
  @Column({ unique: true, nullable: false })
  name: string;

  @Column()
  description: string;

  @OneToMany(() => Role, (role) => role.permissions)
  roles: Role[];

  @OneToMany(() => User, (user) => user.userPermissions)
  users: User[];

  @OneToMany(() => UserPermission, (userPermission) => userPermission.user)
  userPermissions: UserPermission[];
}
