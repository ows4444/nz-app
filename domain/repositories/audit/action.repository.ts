import { Action } from '@database/entities';

import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { BaseRepository } from '../../core';

@Injectable()
export class ActionRepository extends BaseRepository<Action> {
  constructor(entityManager: EntityManager) {
    super(entityManager, Action);
  }
}
