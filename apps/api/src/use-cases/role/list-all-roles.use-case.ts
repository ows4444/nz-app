import { Role } from '@domain/entities';
import { Repository } from '@domain/repositories';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class ListAllRolesUseCase {
  constructor(private readonly dataSource: DataSource) {}

  async execute(): Promise<Role[]> {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const entityManager = queryRunner.manager;
      const repo = new Repository(entityManager);
      return await repo.role.findAll();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}