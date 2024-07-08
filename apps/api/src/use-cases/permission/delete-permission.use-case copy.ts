import { Permission, User } from '@domain/entities';
import { Repository } from '@domain/repositories';
import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class DeletePermissionUseCase {
  constructor(private readonly dataSource: DataSource) {}

  async execute(permissionId: number, user: User): Promise<Permission> {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const entityManager = queryRunner.manager;
      const repo = new Repository(entityManager);
      const permission = await repo.permission.findOneById(permissionId);
      if (!permission) {
        throw new NotFoundException('Permission not found');
      }
      const action = await repo.action.create(repo.action.deletePermissionAction());
      await repo.permission.delete(permissionId);
      await repo.trail.create({
        action,
        user,
        entityId: permission.id,
        entityName: await repo.permission.getEntityName(),
        oldValue: JSON.stringify(permission),
        newValue: JSON.stringify(null),
      });
      return permission;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
