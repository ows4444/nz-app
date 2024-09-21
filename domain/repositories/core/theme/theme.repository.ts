import { Theme } from '@domain/entities';
import { EntityManager } from 'typeorm';
import { BaseRepository } from '@core/repositories';

export class ThemeRepository extends BaseRepository<Theme> {
  constructor(entityManager: EntityManager) {
    super(entityManager, Theme);
  }
}
