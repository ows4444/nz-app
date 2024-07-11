import { User, UserRole } from '@domain/entities';
import { Repository } from '@domain/repositories';
import { ConflictException, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class DetachRoleFromUserUseCase {
  constructor(private readonly dataSource: DataSource) {}

  async execute(userId: number, roleId: number, creator: User): Promise<UserRole> {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const entityManager = queryRunner.manager;
      const repo = new Repository(entityManager);
      const user = await repo.user.findOneById(userId);
      const role = await repo.role.findOneById(roleId);
      if (!user) {
        throw new Error('User not found');
      }
      if (!role) {
        throw new Error('Role not found');
      }
      const userRole = await repo.userRole.findOneBy({ user: user, role: role });
      if (!userRole) {
        throw new ConflictException('Role not attached to user');
      }

      const action = await repo.action.create(repo.action.detachRoleToUserAction());
      await repo.userRole.delete(userRole.id);
      await repo.trail.create({ action, user: creator, entityId: userRole.id, entityName: await repo.userRole.getEntityName(), oldValue: JSON.stringify(userRole) });
      await queryRunner.commitTransaction();
      return userRole;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
