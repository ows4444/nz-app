import { RolePermission, User } from '@domain/entities';
import { Repository } from '@domain/repositories';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class AttachPermissionToRoleUseCase {
  constructor(private readonly dataSource: DataSource) {}

  async execute(permissionId: number, roleId: number, user: User): Promise<RolePermission> {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const entityManager = queryRunner.manager;
      const repo = new Repository(entityManager);

      const role = await repo.role.findOneById(roleId);
      if (!role) {
        throw new NotFoundException('Role not found');
      }

      const permission = await repo.permission.findOneById(permissionId);
      if (!permission) {
        throw new NotFoundException('Permission not found');
      }

      if (await repo.rolePermission.findOneBy({ permission: permission, role: role })) {
        throw new ConflictException('Permission already attached to role');
      }

      const action = await repo.action.create(repo.action.attachPermissionToRoleAction());
      const rolePermission = await repo.rolePermission.create({ permission, role });
      await repo.trail.create({ action, user, entityId: rolePermission.id, entityName: await repo.rolePermission.getEntityName(), newValue: JSON.stringify(rolePermission) });
      return rolePermission;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
