import { Component, User } from '@domain/entities';
import { Repository } from '@domain/repositories';
import { ConflictException, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class CreateComponentUseCase {
  constructor(private readonly dataSource: DataSource) {}

  async execute(ComponentPayload: Partial<Component>, user: User): Promise<Component> {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const entityManager = queryRunner.manager;
      const repo = new Repository(entityManager);
      if (await repo.component.findOneBy({ name: ComponentPayload.name })) {
        throw new ConflictException('Component already exists');
      }
      const action = await repo.action.create(repo.action.createComponentAction());
      const component = await repo.component.create({ name: ComponentPayload.name, description: ComponentPayload.description });
      await repo.trail.create({ action, user, entityId: component.id, entityName: await repo.component.getEntityName(), newValue: JSON.stringify(component) });
      await queryRunner.commitTransaction();
      return component;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
