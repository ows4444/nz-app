import { User } from '@domain/entities';
import { Repository } from '@domain/repositories';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class CreateRootUserUseCase {
  constructor(private readonly dataSource: DataSource) {}

  async execute(): Promise<User> {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const entityManager = queryRunner.manager;
      const repo = new Repository(entityManager);
      if (await repo.user.findOneBy({ username: 'root' })) {
        throw new Error('Root user already exists');
      }
      const action = await repo.action.create(repo.action.createUserAction());
      const user = await repo.user.create({ email: 'root@nizaami.com', password: 'rootroot', name: 'Root User', username: 'root' });
      await repo.trail.create({ action, user, entityId: user.id, entityName: await repo.user.getEntityName(), newValue: JSON.stringify(user) });
      await queryRunner.commitTransaction();
      return user;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
