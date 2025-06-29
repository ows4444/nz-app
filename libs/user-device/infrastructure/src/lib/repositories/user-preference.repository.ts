import { Injectable } from '@nestjs/common';
import { UserPreferenceEntity } from '@nz/user-device-domain';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { UserPreferenceEntityORM } from '../entities';
import { UserPreferenceMapper } from '../mappers';

@Injectable()
export class TypeormUserPreferenceRepository {
  private repository: Repository<UserPreferenceEntityORM>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(UserPreferenceEntityORM);
  }

  private getRepository(queryRunner?: QueryRunner): Repository<UserPreferenceEntityORM> {
    return queryRunner ? queryRunner.manager.getRepository(UserPreferenceEntityORM) : this.repository;
  }

  async save(userPreference: UserPreferenceEntity, qr?: QueryRunner): Promise<UserPreferenceEntity> {
    const orm = UserPreferenceMapper.toPersistence(userPreference);
    const saved = await this.getRepository(qr).save(orm);
    return UserPreferenceMapper.toDomain(saved);
  }
}
