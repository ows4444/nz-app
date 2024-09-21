import { Theme, User } from '@domain/entities';
import { Repository } from '@domain/repositories';
import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class DeleteThemeUseCase {
  constructor(private readonly dataSource: DataSource) {}

  async execute(themeId: number, user: User): Promise<Theme> {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const entityManager = queryRunner.manager;
      const repo = new Repository(entityManager);
      const theme = await repo.theme.findOneById(themeId);
      if (!theme) {
        throw new NotFoundException('Theme not found');
      }
      const action = await repo.action.create(repo.action.deleteThemeAction());
      await repo.theme.delete(themeId);
      await repo.trail.create({
        action,
        user,
        entityId: theme.id,
        entityName: await repo.theme.getEntityName(),
        oldValue: JSON.stringify(theme),
        newValue: JSON.stringify(null),
      });
      await queryRunner.commitTransaction();
      return theme;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
