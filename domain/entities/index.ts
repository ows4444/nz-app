import { Action, Trail } from './audit';
import { Component, Property, Theme } from './core';
import { Permission, PermissionStatus } from './permission';
import { Role, RolePermission, RolePermissionStatus, RoleStatus } from './role';
import { Session } from './session';
import { User, UserPermission, UserPermissionStatus, UserRole, UserRoleStatus, UserStatus } from './user';

export const entities = [Component, Theme, Property, User, Role, UserRole, Permission, RolePermission, UserPermission, Trail, Action, Session];

export {
  // Core
  Component,
  Theme,
  Property,
  // Entities
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
