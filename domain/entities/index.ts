import { Action, Trail } from './audit';
import { Permission } from './permission';
import { Role, RolePermission } from './role';
import { User, UserPermission, UserRole } from './user';
import { Session } from './session';

export const entities = [User, Role, UserRole, Permission, RolePermission, UserPermission, Trail, Action, Session];

export { User, Role, UserRole, Permission, RolePermission, UserPermission, Trail, Action, Session };
