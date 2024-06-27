import { Trail } from '@database/entities';

import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { BaseRepository } from '../../core';

@Injectable()
export class TrailRepository extends BaseRepository<Trail> {
  constructor(entityManager: EntityManager) {
    super(entityManager, Trail);
  }
}
