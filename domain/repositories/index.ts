import { ActionRepository, TrailRepository } from './audit';
import { PermissionRepository } from './permission';
import { RolePermissionRepository, RoleRepository } from './role';
import { SessionRepository } from './session';
import { UserPermissionRepository, UserRepository, UserRoleRepository } from './user';

export const Repositories = [
  UserRepository,
  UserRoleRepository,
  UserPermissionRepository,
  SessionRepository,
  RoleRepository,
  RolePermissionRepository,
  PermissionRepository,
  ActionRepository,
  TrailRepository,
];

export { UserRepository, UserRoleRepository, UserPermissionRepository, SessionRepository, RoleRepository, RolePermissionRepository, PermissionRepository, ActionRepository, TrailRepository };
