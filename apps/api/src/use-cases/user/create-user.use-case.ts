import { User } from '@domain/entities';
import { Repository } from '@domain/repositories';
import { ConflictException, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly dataSource: DataSource) {}

  async execute(email: string, password: string, name: string, username: string, creator: User): Promise<User> {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const entityManager = queryRunner.manager;
      const repo = new Repository(entityManager);
      if (await repo.user.findOneBy({ username })) {
        throw new ConflictException('User already exists');
      }
      const action = await repo.action.create(repo.action.createUserAction());
      const user = await repo.user.create({ email, password, name, username });
      await repo.trail.create({ action, user: creator, entityId: user.id, entityName: await repo.user.getEntityName(), newValue: JSON.stringify(user) });
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
