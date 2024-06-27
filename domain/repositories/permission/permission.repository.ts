import { Permission } from '@domain/entities';
import { EntityManager } from 'typeorm';
import { BaseRepository } from '@core/repositories';

export class PermissionRepository extends BaseRepository<Permission> {
  constructor(entityManager: EntityManager) {
    super(entityManager, Permission);
  }
}
