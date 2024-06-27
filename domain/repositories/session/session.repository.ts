import { Session } from '@database/entities';

import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { BaseRepository } from '../../core';

@Injectable()
export class SessionRepository extends BaseRepository<Session> {
  constructor(entityManager: EntityManager) {
    super(entityManager, Session);
  }
}
