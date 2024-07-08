import { Permission, User } from '@domain/entities';
import { Repository } from '@domain/repositories';
import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class UpdatePermissionUseCase {
  constructor(private readonly dataSource: DataSource) {}

  async execute(permissionId: number, permissionPayload: Partial<Permission>, user: User): Promise<Permission> {
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
      const action = await repo.action.create(repo.action.updatePermissionAction());
      const updatedPermission = await repo.permission.update(permissionId, permissionPayload);
      await repo.trail.create({
        action,
        user,
        entityId: permission.id,
        entityName: await repo.permission.getEntityName(),
        oldValue: JSON.stringify(permission),
        newValue: JSON.stringify(updatedPermission),
      });
      return updatedPermission;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
