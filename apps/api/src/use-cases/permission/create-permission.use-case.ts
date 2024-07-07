import { Permission, User } from '@domain/entities';
import { Repository } from '@domain/repositories';
import { ConflictException, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class CreatePermissionUseCase {
  constructor(private readonly dataSource: DataSource) {}

  async execute(PermissionPayload: Partial<Permission>, user: User): Promise<Permission> {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const entityManager = queryRunner.manager;
      const repo = new Repository(entityManager);
      if (await repo.permission.findOneBy({ name: PermissionPayload.name })) {
        throw new ConflictException('Permission already exists');
      }
      const action = await repo.action.create(repo.action.createPermissionAction());
      const permission = await repo.permission.create({ name: PermissionPayload.name, description: PermissionPayload.description });
      await repo.trail.create({ action, user, entityId: permission.id, entityName: await repo.permission.getEntityName(), newValue: JSON.stringify(permission) });
      return permission;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
