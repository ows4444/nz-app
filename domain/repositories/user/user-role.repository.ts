import { UserRole } from '@database/entities';
import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { BaseRepository } from '../../core';

@Injectable()
export class UserRoleRepository extends BaseRepository<UserRole> {
  constructor(entityManager: EntityManager) {
    super(entityManager, UserRole);
  }
}
