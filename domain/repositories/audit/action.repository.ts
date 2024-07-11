import { Action } from '@domain/entities';
import { DeepPartial, EntityManager } from 'typeorm';
import { BaseRepository } from '@core/repositories';

export class ActionRepository extends BaseRepository<Action> {
  constructor(entityManager: EntityManager) {
    super(entityManager, Action);
  }

  createUserAction(): DeepPartial<Action> {
    return {
      actionType: 'CREATED_A_USER',
      description: 'Created a user',
    };
  }

  attachRoleToUserAction(): DeepPartial<Action> {
    return {
      actionType: 'ATTACHED_ROLE_TO_USER',
      description: 'Attached role to user',
    };
  }

  detachRoleToUserAction(): DeepPartial<Action> {
    return {
      actionType: 'DETACHED_ROLE_TO_USER',
      description: 'Detached role to user',
    };
  }

  createRoleAction(): DeepPartial<Action> {
    return {
      actionType: 'CREATED_A_ROLE',
      description: 'Created a role',
    };
  }

  createPermissionAction(): DeepPartial<Action> {
    return {
      actionType: 'CREATED_A_PERMISSION',
      description: 'Created a permission',
    };
  }

  updatePermissionAction(): DeepPartial<Action> {
    return {
      actionType: 'UPDATED_A_PERMISSION',
      description: 'Updated a permission',
    };
  }

  deletePermissionAction(): DeepPartial<Action> {
    return {
      actionType: 'DELETED_A_PERMISSION',
      description: 'Deleted a permission',
    };
  }

  attachPermissionToRoleAction(): DeepPartial<Action> {
    return {
      actionType: 'ATTACHED_PERMISSION_TO_ROLE',
      description: 'Attached permission to role',
    };
  }

  detachPermissionFromRoleAction(): DeepPartial<Action> {
    return {
      actionType: 'DETACHED_PERMISSION_FROM_ROLE',
      description: 'Detached permission from role',
    };
  }
}
