import { Repository } from '@domain/repositories';
import { Injectable } from '@nestjs/common';
import { DataSource, QueryFailedError } from 'typeorm';

@Injectable()
export class CreateRootUserUseCase {
  constructor(private readonly dataSource: DataSource) {}

  async execute(): Promise<boolean> {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const entityManager = queryRunner.manager;
      const repo = new Repository(entityManager);
      const action = await repo.action.create(repo.action.createUserAction());
      const user = await repo.user.create({ email: 'root@nizaami.com', password: 'root', name: 'Root User', username: 'root', creator: { id: 1 }, editor: { id: 1 } });
      await repo.trail.create({ action, user, entityId: user.id, entityName: await repo.user.getEntityName(), newValue: JSON.stringify(user) });

      return true;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof QueryFailedError) {
        switch (error.driverError.code) {
          case 'ER_DUP_ENTRY':
            return false;
          case 'ER_NO_REFERENCED_ROW_2':
            return false;
          default:
            throw error;
        }
      }

      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
