import { UserRole } from '@domain/entities';
import { EntityManager } from 'typeorm';
import { BaseRepository } from '@core/repositories';

export class UserRoleRepository extends BaseRepository<UserRole> {
  constructor(entityManager: EntityManager) {
    super(entityManager, UserRole);
  }
}
