import { EntityManager } from 'typeorm';

import { BaseRepository } from '@core/repositories';
import { Property } from '@domain/entities';

export class PropertyRepository extends BaseRepository<Property> {
  constructor(entityManager: EntityManager) {
    super(entityManager, Property);
  }
}
