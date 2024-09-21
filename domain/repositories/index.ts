import { EntityManager } from 'typeorm';

import { ActionRepository, TrailRepository } from './audit';
import { ComponentRepository, ThemeRepository } from './core';
import { PermissionRepository } from './permission';
import { RolePermissionRepository, RoleRepository } from './role';
import { SessionRepository } from './session';
import { UserPermissionRepository, UserRepository, UserRoleRepository } from './user';

export const Repositories = [
  ComponentRepository,
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

export class Repository {
  public readonly component: ComponentRepository;
  public readonly theme: ThemeRepository;
  public readonly user: UserRepository;
  public readonly userRole: UserRoleRepository;
  public readonly userPermission: UserPermissionRepository;
  public readonly session: SessionRepository;
  public readonly role: RoleRepository;
  public readonly rolePermission: RolePermissionRepository;
  public readonly permission: PermissionRepository;
  public readonly action: ActionRepository;
  public readonly trail: TrailRepository;

  constructor(entityManager: EntityManager) {
    this.component = new ComponentRepository(entityManager);
    this.theme = new ThemeRepository(entityManager);
    this.user = new UserRepository(entityManager);
    this.userRole = new UserRoleRepository(entityManager);
    this.userPermission = new UserPermissionRepository(entityManager);
    this.session = new SessionRepository(entityManager);
    this.role = new RoleRepository(entityManager);
    this.rolePermission = new RolePermissionRepository(entityManager);
    this.permission = new PermissionRepository(entityManager);
    this.action = new ActionRepository(entityManager);
    this.trail = new TrailRepository(entityManager);
  }
}

export {
  ComponentRepository,
  ThemeRepository,
  UserRepository,
  UserRoleRepository,
  UserPermissionRepository,
  SessionRepository,
  RoleRepository,
  RolePermissionRepository,
  PermissionRepository,
  ActionRepository,
  TrailRepository,
};
