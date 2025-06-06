import { Injectable } from '@nestjs/common';
import { InboxEventEntity } from '@nz/shared-domain';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { InboxEventEntityORM } from '../entities';
import { InboxEventMapper } from '../mappers';

@Injectable()
export class TypeormInboxRepository {
  private repository: Repository<InboxEventEntityORM>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(InboxEventEntityORM);
  }

  private getRepository(queryRunner?: QueryRunner): Repository<InboxEventEntityORM> {
    return queryRunner ? queryRunner.manager.getRepository(InboxEventEntityORM) : this.repository;
  }

  async findOneById(id: string, qr?: QueryRunner): Promise<InboxEventEntity | null> {
    const orm = await this.getRepository(qr).findOne({ where: { id } });
    return orm ? InboxEventMapper.toDomain(orm) : null;
  }

  async save(inboxEvent: InboxEventEntity, qr?: QueryRunner): Promise<InboxEventEntity> {
    const orm = InboxEventMapper.toPersistence(inboxEvent);
    const saved = await this.getRepository(qr).save(orm);
    return InboxEventMapper.toDomain(saved);
  }
}
