import { Injectable } from '@nestjs/common';
import { EventRoutingRuleEntity } from '@nz/shared-domain';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { EventRoutingRuleEntityORM } from '../entities';
import { EventRoutingRuleMapper } from '../mappers';

@Injectable()
export class TypeormEventRoutingRuleRepository {
  private repository: Repository<EventRoutingRuleEntityORM>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(EventRoutingRuleEntityORM);
  }

  private getRepository(queryRunner?: QueryRunner): Repository<EventRoutingRuleEntityORM> {
    return queryRunner ? queryRunner.manager.getRepository(EventRoutingRuleEntityORM) : this.repository;
  }

  async findOneById(id: string, qr?: QueryRunner): Promise<EventRoutingRuleEntity | null> {
    const orm = await this.getRepository(qr).findOne({ where: { id } });
    return orm ? EventRoutingRuleMapper.toDomain(orm) : null;
  }

  async save(eventRoutingRule: EventRoutingRuleEntity, qr?: QueryRunner): Promise<EventRoutingRuleEntity> {
    const orm = EventRoutingRuleMapper.toPersistence(eventRoutingRule);
    const saved = await this.getRepository(qr).save(orm);
    return EventRoutingRuleMapper.toDomain(saved);
  }
}
