import { Injectable } from '@nestjs/common';
import { UserPasswordHistoryEntity } from '@nz/auth-session-domain';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { UserPasswordHistoryEntityORM } from '../entities/user-password-history.entity';
import { UserPasswordHistoryMapper } from '../mappers';

@Injectable()
export class TypeormUserPasswordHistoryRepository {
  private repository: Repository<UserPasswordHistoryEntityORM>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(UserPasswordHistoryEntityORM);
  }

  private getRepository(queryRunner?: QueryRunner): Repository<UserPasswordHistoryEntityORM> {
    return queryRunner ? queryRunner.manager.getRepository(UserPasswordHistoryEntityORM) : this.repository;
  }

  async findOneByUserId(userId: string, qr?: QueryRunner): Promise<UserPasswordHistoryEntity | null> {
    const orm = await this.getRepository(qr).findOne({ where: { userId } });
    return orm ? UserPasswordHistoryMapper.toDomain(orm) : null;
  }

  async save(UserPasswordHistory: UserPasswordHistoryEntity, qr?: QueryRunner): Promise<UserPasswordHistoryEntity> {
    const orm = UserPasswordHistoryMapper.toPersistence(UserPasswordHistory);
    const saved = await this.getRepository(qr).save(orm);
    return UserPasswordHistoryMapper.toDomain(saved);
  }
}
