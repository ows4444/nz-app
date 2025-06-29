import { Injectable } from '@nestjs/common';
import { EventSubscriptionEntity } from '@nz/shared-domain';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { EventSubscriptionEntityORM } from '../entities';
import { EventSubscriptionMapper } from '../mappers';

@Injectable()
export class TypeormEventSubscriptionRepository {
  private repository: Repository<EventSubscriptionEntityORM>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(EventSubscriptionEntityORM);
  }

  private getRepository(queryRunner?: QueryRunner): Repository<EventSubscriptionEntityORM> {
    return queryRunner ? queryRunner.manager.getRepository(EventSubscriptionEntityORM) : this.repository;
  }

  async findOneById(id: string, qr?: QueryRunner): Promise<EventSubscriptionEntity | null> {
    const orm = await this.getRepository(qr).findOne({ where: { id } });
    return orm ? EventSubscriptionMapper.toDomain(orm) : null;
  }

  async save(eventSubscription: EventSubscriptionEntity, qr?: QueryRunner): Promise<EventSubscriptionEntity> {
    const orm = EventSubscriptionMapper.toPersistence(eventSubscription);
    const saved = await this.getRepository(qr).save(orm);
    return EventSubscriptionMapper.toDomain(saved);
  }
}
