import { BaseRepository } from '@core/repositories';
import { User } from '@domain/entities';
import { EntityManager } from 'typeorm';
export class UserRepository extends BaseRepository<User> {
  constructor(entityManager: EntityManager) {
    super(entityManager, User);
  }
}
