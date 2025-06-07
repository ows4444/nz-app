import { Injectable } from '@nestjs/common';
import { EventProcessingMetricsEntity } from '@nz/shared-domain';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { EventProcessingMetricsEntityORM } from '../entities';
import { EventProcessingMetricsMapper } from '../mappers';

@Injectable()
export class TypeormEventProcessingMetricsRepository {
  private repository: Repository<EventProcessingMetricsEntityORM>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(EventProcessingMetricsEntityORM);
  }

  private getRepository(queryRunner?: QueryRunner): Repository<EventProcessingMetricsEntityORM> {
    return queryRunner ? queryRunner.manager.getRepository(EventProcessingMetricsEntityORM) : this.repository;
  }

  async findOneById(id: string, qr?: QueryRunner): Promise<EventProcessingMetricsEntity | null> {
    const orm = await this.getRepository(qr).findOne({ where: { id } });
    return orm ? EventProcessingMetricsMapper.toDomain(orm) : null;
  }

  async save(eventProcessingMetrics: EventProcessingMetricsEntity, qr?: QueryRunner): Promise<EventProcessingMetricsEntity> {
    const orm = EventProcessingMetricsMapper.toPersistence(eventProcessingMetrics);
    const saved = await this.getRepository(qr).save(orm);
    return EventProcessingMetricsMapper.toDomain(saved);
  }
}
