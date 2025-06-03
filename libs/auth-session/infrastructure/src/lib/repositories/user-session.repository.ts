import { Injectable } from '@nestjs/common';
import { UserSessionEntity } from '@nz/auth-session-domain';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { UserSessionEntityORM } from '../entities';
import { UserSessionMapper } from '../mappers';

@Injectable()
export class TypeormUserSessionRepository {
  private repository: Repository<UserSessionEntityORM>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(UserSessionEntityORM);
  }

  private getRepository(queryRunner?: QueryRunner): Repository<UserSessionEntityORM> {
    return queryRunner ? queryRunner.manager.getRepository(UserSessionEntityORM) : this.repository;
  }

  async findOneByUserId(userId: string, qr?: QueryRunner): Promise<UserSessionEntity | null> {
    const orm = await this.getRepository(qr).findOne({ where: { userId } });
    return orm ? UserSessionMapper.toDomain(orm) : null;
  }

  async save(UserSession: UserSessionEntity, qr?: QueryRunner): Promise<UserSessionEntity> {
    const orm = UserSessionMapper.toPersistence(UserSession);
    const saved = await this.getRepository(qr).save(orm);
    return UserSessionMapper.toDomain(saved);
  }
}
