import { Component } from '@domain/entities';
import { Repository } from '@domain/repositories';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class ListAllComponentUseCase {
  constructor(private readonly dataSource: DataSource) {}

  async execute(): Promise<Component[]> {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      const entityManager = queryRunner.manager;
      const repo = new Repository(entityManager);

      return await repo.component.findAll();
    } finally {
      await queryRunner.release();
    }
  }
}
