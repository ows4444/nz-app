import { Role } from '@database/entities';

import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { BaseRepository } from '../../core';

@Injectable()
export class RoleRepository extends BaseRepository<Role> {
  constructor(entityManager: EntityManager) {
    super(entityManager, Role);
  }
}
