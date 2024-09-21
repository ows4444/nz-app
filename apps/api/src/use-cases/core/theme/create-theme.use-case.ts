import { Theme, User } from '@domain/entities';
import { Repository } from '@domain/repositories';
import { ConflictException, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class CreateThemeUseCase {
  constructor(private readonly dataSource: DataSource) {}

  async execute(ThemePayload: Partial<Theme>, user: User): Promise<Theme> {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const entityManager = queryRunner.manager;
      const repo = new Repository(entityManager);
      if (await repo.theme.findOneBy({ name: ThemePayload.name })) {
        throw new ConflictException('Theme already exists');
      }
      const action = await repo.action.create(repo.action.createThemeAction());
      const theme = await repo.theme.create({ name: ThemePayload.name, description: ThemePayload.description });
      await repo.trail.create({ action, user, entityId: theme.id, entityName: await repo.theme.getEntityName(), newValue: JSON.stringify(theme) });
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
