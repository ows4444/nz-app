import { Trail } from '@domain/entities';
import { EntityManager } from 'typeorm';
import { BaseRepository } from '@core/repositories';

export class TrailRepository extends BaseRepository<Trail> {
  constructor(entityManager: EntityManager) {
    super(entityManager, Trail);
  }
}
