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
}
