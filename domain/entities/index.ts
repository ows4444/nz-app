import { Action, Trail } from './audit';
import { Permission, PermissionStatus } from './permission';
import { Role, RolePermissionStatus, RolePermission, RoleStatus } from './role';
import { User, UserStatus, UserPermission, UserPermissionStatus, UserRole, UserRoleStatus } from './user';
import { Session } from './session';

export const entities = [User, Role, UserRole, Permission, RolePermission, UserPermission, Trail, Action, Session];

export {
  User,
  Role,
  UserRole,
  Permission,
  RolePermission,
  UserPermission,
  Trail,
  Action,
  Session,
  // Enums
  UserStatus,
  RoleStatus,
  UserRoleStatus,
  PermissionStatus,
  RolePermissionStatus,
  UserPermissionStatus,
};
