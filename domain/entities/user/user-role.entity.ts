import { Entity, Index, ManyToOne } from 'typeorm';
import { Role } from '../role/role.entity';
import { User } from './user.entity';
import { AbstractTableEntity } from '@core/entities';

@Entity()
@Index(['user', 'role'], { unique: true })
export class UserRole extends AbstractTableEntity<UserRole> {
  @ManyToOne(() => User, (user) => user.userRoles)
  user: User;

  @ManyToOne(() => Role, (role) => role.userRoles)
  role: Role;
}
