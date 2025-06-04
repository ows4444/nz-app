import { Injectable } from '@nestjs/common';
import { PasswordResetEntity } from '@nz/auth-session-domain';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { PasswordResetEntityORM } from '../entities';
import { PasswordResetMapper } from '../mappers';

@Injectable()
export class TypeormPasswordResetRepository {
  private repository: Repository<PasswordResetEntityORM>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(PasswordResetEntityORM);
  }

  private getRepository(queryRunner?: QueryRunner): Repository<PasswordResetEntityORM> {
    return queryRunner ? queryRunner.manager.getRepository(PasswordResetEntityORM) : this.repository;
  }

  async save(passwordReset: PasswordResetEntity, qr?: QueryRunner): Promise<PasswordResetEntity> {
    const orm = PasswordResetMapper.toPersistence(passwordReset);
    const saved = await this.getRepository(qr).save(orm);
    return PasswordResetMapper.toDomain(saved);
  }
}
