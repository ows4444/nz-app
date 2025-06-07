import { Injectable } from '@nestjs/common';
import { DeadLetterEventEntity } from '@nz/shared-domain';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { DeadLetterEventEntityORM } from '../entities';
import { DeadLetterEventMapper } from '../mappers';

@Injectable()
export class TypeormDeadLetterEventRepository {
  private repository: Repository<DeadLetterEventEntityORM>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(DeadLetterEventEntityORM);
  }

  private getRepository(queryRunner?: QueryRunner): Repository<DeadLetterEventEntityORM> {
    return queryRunner ? queryRunner.manager.getRepository(DeadLetterEventEntityORM) : this.repository;
  }

  async findOneById(id: string, qr?: QueryRunner): Promise<DeadLetterEventEntity | null> {
    const orm = await this.getRepository(qr).findOne({ where: { id } });
    return orm ? DeadLetterEventMapper.toDomain(orm) : null;
  }

  async save(deadLetterEvent: DeadLetterEventEntity, qr?: QueryRunner): Promise<DeadLetterEventEntity> {
    const orm = DeadLetterEventMapper.toPersistence(deadLetterEvent);
    const saved = await this.getRepository(qr).save(orm);
    return DeadLetterEventMapper.toDomain(saved);
  }
}
