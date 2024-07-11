import { RolePermission } from '@domain/entities';
import { Repository } from '@domain/repositories';
import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class ListAllRolePermissionsUseCase {
  constructor(private readonly dataSource: DataSource) {}

  async execute(roleId: number): Promise<RolePermission[]> {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      const entityManager = queryRunner.manager;
      const repo = new Repository(entityManager);
      const role = await repo.role.findOneById(roleId);
      if (!role) {
        throw new NotFoundException('Role not found');
      }
      return await repo.rolePermission.findAllBy({
        where: { role },
        join: {
          alias: 'rolePermission',
          leftJoinAndSelect: {
            permission: 'rolePermission.permission',
          },
        },
      });
    } finally {
      await queryRunner.release();
    }
  }
}
