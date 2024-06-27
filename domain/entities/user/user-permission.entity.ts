import { Entity, Index, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Permission } from '../permission';
import { AbstractTableEntity } from '@core/entities';

@Entity()
@Index(['user', 'permission'], { unique: true })
export class UserPermission extends AbstractTableEntity<UserPermission> {
  @ManyToOne(() => User, (user) => user.userPermissions)
  user: User;

  @ManyToOne(() => Permission, (permission) => permission.userPermissions)
  permission: Permission;
}
