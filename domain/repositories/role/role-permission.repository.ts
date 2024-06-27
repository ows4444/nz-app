import { RolePermission } from '@domain/entities';
import { EntityManager } from 'typeorm';
import { BaseRepository } from '@core/repositories';

export class RolePermissionRepository extends BaseRepository<RolePermission> {
  constructor(entityManager: EntityManager) {
    super(entityManager, RolePermission);
  }
}
