import { Session } from '@domain/entities';
import { EntityManager } from 'typeorm';
import { BaseRepository } from '@core/repositories';

export class SessionRepository extends BaseRepository<Session> {
  constructor(entityManager: EntityManager) {
    super(entityManager, Session);
  }
}
