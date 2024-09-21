import { Component, User } from '@domain/entities';
import { Repository } from '@domain/repositories';
import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class UpdateComponentUseCase {
  constructor(private readonly dataSource: DataSource) {}

  async execute(componentId: number, componentPayload: Partial<Component>, user: User): Promise<Component> {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const entityManager = queryRunner.manager;
      const repo = new Repository(entityManager);
      const component = await repo.component.findOneById(componentId);
      if (!component) {
        throw new NotFoundException('Component not found');
      }
      const action = await repo.action.create(repo.action.updateComponentAction());
      const updatedComponent = await repo.component.update(componentId, componentPayload);
      await repo.trail.create({
        action,
        user,
        entityId: component.id,
        entityName: await repo.component.getEntityName(),
        oldValue: JSON.stringify(component),
        newValue: JSON.stringify(updatedComponent),
      });
      await queryRunner.commitTransaction();
      return updatedComponent;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
