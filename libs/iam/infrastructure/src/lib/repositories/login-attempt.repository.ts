import { Injectable } from '@nestjs/common';
import { LoginAttemptEntity } from '@nz/iam-domain';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { LoginAttemptEntityORM } from '../entities/login-attempt.entity';
import { LoginAttemptMapper } from '../mappers/login-attempt.mapper';

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
    const orm = await this.getRepository(qr).findOne({ where: { user: { id: userId } } });
    return orm ? LoginAttemptMapper.toDomain(orm) : null;
  }

  async save(LoginAttempt: LoginAttemptEntity, qr?: QueryRunner): Promise<LoginAttemptEntity> {
    const orm = LoginAttemptMapper.toPersistence(LoginAttempt);
    const saved = await this.getRepository(qr).save(orm);
    return LoginAttemptMapper.toDomain(saved);
  }
}
