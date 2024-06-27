import { Role } from '@domain/entities';
import { EntityManager } from 'typeorm';
import { BaseRepository } from '@core/repositories';

export class RoleRepository extends BaseRepository<Role> {
  constructor(entityManager: EntityManager) {
    super(entityManager, Role);
  }
}
