import { Injectable } from '@nestjs/common';
import { SessionPolicyEntity } from '@nz/auth-session-domain';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { SessionPolicyEntityORM } from '../entities';
import { SessionPolicyMapper } from '../mappers';

@Injectable()
export class TypeormSessionPolicyRepository {
  private repository: Repository<SessionPolicyEntityORM>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(SessionPolicyEntityORM);
  }

  private getRepository(queryRunner?: QueryRunner): Repository<SessionPolicyEntityORM> {
    return queryRunner ? queryRunner.manager.getRepository(SessionPolicyEntityORM) : this.repository;
  }

  async findOneByPolicyId(id: string, qr?: QueryRunner): Promise<SessionPolicyEntity | null> {
    const orm = await this.getRepository(qr).findOne({ where: { id } });
    return orm ? SessionPolicyMapper.toDomain(orm) : null;
  }

  async save(sessionPolicy: SessionPolicyEntity, qr?: QueryRunner): Promise<SessionPolicyEntity> {
    const orm = SessionPolicyMapper.toPersistence(sessionPolicy);
    const saved = await this.getRepository(qr).save(orm);
    return SessionPolicyMapper.toDomain(saved);
  }
}
