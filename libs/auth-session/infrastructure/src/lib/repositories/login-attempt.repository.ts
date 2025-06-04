import { Injectable } from '@nestjs/common';
import { LoginAttemptEntity } from '@nz/auth-session-domain';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { LoginAttemptEntityORM } from '../entities';
import { LoginAttemptMapper } from '../mappers';

@Injectable()
export class TypeormLoginAttemptRepository {
  private repository: Repository<LoginAttemptEntityORM>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(LoginAttemptEntityORM);
  }

  private getRepository(queryRunner?: QueryRunner): Repository<LoginAttemptEntityORM> {
    return queryRunner ? queryRunner.manager.getRepository(LoginAttemptEntityORM) : this.repository;
  }

  async findOneById(id: number, qr?: QueryRunner): Promise<LoginAttemptEntity | null> {
    const orm = await this.getRepository(qr).findOne({ where: { id } });
    return orm ? LoginAttemptMapper.toDomain(orm) : null;
  }

  async findOneByUserId(userId: string, qr?: QueryRunner): Promise<LoginAttemptEntity | null> {
    const orm = await this.getRepository(qr).findOne({ where: { userId } });
    return orm ? LoginAttemptMapper.toDomain(orm) : null;
  }

  async save(loginAttempt: LoginAttemptEntity, qr?: QueryRunner): Promise<LoginAttemptEntity> {
    const orm = LoginAttemptMapper.toPersistence(loginAttempt);
    const saved = await this.getRepository(qr).save(orm);
    return LoginAttemptMapper.toDomain(saved);
  }
}
