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

  attachPermissionToRoleAction(): DeepPartial<Action> {
    return {
      actionType: 'ATTACHED_PERMISSION_TO_ROLE',
      description: 'Attached permission to role',
    };
  }
}
