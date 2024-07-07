import { Role, User } from '@domain/entities';
import { Repository } from '@domain/repositories';
import { ConflictException, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class CreateRoleUseCase {
  constructor(private readonly dataSource: DataSource) {}

  async execute(rolePayload: Partial<Role>, user: User): Promise<Role> {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const entityManager = queryRunner.manager;
      const repo = new Repository(entityManager);
      if (await repo.role.findOneBy({ name: rolePayload.name })) {
        throw new ConflictException('Role already exists');
      }
      const action = await repo.action.create(repo.action.createRoleAction());
      const role = await repo.role.create({ name: rolePayload.name, description: rolePayload.description });
      await repo.trail.create({ action, user, entityId: role.id, entityName: await repo.role.getEntityName(), newValue: JSON.stringify(role) });
      return role;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
