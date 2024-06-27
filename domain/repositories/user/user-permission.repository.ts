import { UserPermission } from '@database/entities';
import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { BaseRepository } from '../../core';

@Injectable()
export class UserPermissionRepository extends BaseRepository<UserPermission> {
  constructor(entityManager: EntityManager) {
    super(entityManager, UserPermission);
  }
}
