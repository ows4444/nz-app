import { Permission } from '@database/entities';

import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { BaseRepository } from '../../core';

@Injectable()
export class PermissionRepository extends BaseRepository<Permission> {
  constructor(entityManager: EntityManager) {
    super(entityManager, Permission);
  }
}
