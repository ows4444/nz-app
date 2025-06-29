import { Injectable } from '@nestjs/common';
import { OutboxEventEntity } from '@nz/shared-domain';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { OutboxEventEntityORM } from '../entities';
import { OutboxEventMapper } from '../mappers';

@Injectable()
export class TypeormOutboxEventRepository {
  private repository: Repository<OutboxEventEntityORM>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(OutboxEventEntityORM);
  }

  private getRepository(queryRunner?: QueryRunner): Repository<OutboxEventEntityORM> {
    return queryRunner ? queryRunner.manager.getRepository(OutboxEventEntityORM) : this.repository;
  }

  async findOneById(id: string, qr?: QueryRunner): Promise<OutboxEventEntity | null> {
    const orm = await this.getRepository(qr).findOne({ where: { id } });
    return orm ? OutboxEventMapper.toDomain(orm) : null;
  }

  async findPending(take: number, qr?: QueryRunner): Promise<OutboxEventEntity[]> {
    const orm = await this.getRepository(qr).find({ where: { status: 'pending' }, take });
    return orm.map(OutboxEventMapper.toDomain);
  }

  async save(outboxEvent: OutboxEventEntity, qr?: QueryRunner): Promise<OutboxEventEntity> {
    const orm = OutboxEventMapper.toPersistence(outboxEvent);
    const saved = await this.getRepository(qr).save(orm);
    return OutboxEventMapper.toDomain(saved);
  }
}
