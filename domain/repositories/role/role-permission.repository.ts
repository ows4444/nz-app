import { RolePermission } from '@database/entities';

import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { BaseRepository } from '../../core';

@Injectable()
export class RolePermissionRepository extends BaseRepository<RolePermission> {
  constructor(entityManager: EntityManager) {
    super(entityManager, RolePermission);
  }
}
