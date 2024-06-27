import { User } from '@database/entities';

import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { BaseRepository } from '../../core';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(entityManager: EntityManager) {
    super(entityManager, User);
  }
}
