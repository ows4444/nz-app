import { UserPermission } from '@domain/entities';
import { EntityManager } from 'typeorm';
import { BaseRepository } from '@core/repositories';

export class UserPermissionRepository extends BaseRepository<UserPermission> {
  constructor(entityManager: EntityManager) {
    super(entityManager, UserPermission);
  }
}
