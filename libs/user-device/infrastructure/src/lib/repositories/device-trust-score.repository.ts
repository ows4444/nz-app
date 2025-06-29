import { Injectable } from '@nestjs/common';
import { DeviceTrustScoreEntity } from '@nz/user-device-domain';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { DeviceTrustScoreEntityORM } from '../entities';
import { DeviceTrustScoreMapper } from '../mappers';

@Injectable()
export class TypeormDeviceTrustScoreRepository {
  private repository: Repository<DeviceTrustScoreEntityORM>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(DeviceTrustScoreEntityORM);
  }

  private getRepository(queryRunner?: QueryRunner): Repository<DeviceTrustScoreEntityORM> {
    return queryRunner ? queryRunner.manager.getRepository(DeviceTrustScoreEntityORM) : this.repository;
  }

  async save(deviceTrustScore: DeviceTrustScoreEntity, qr?: QueryRunner): Promise<DeviceTrustScoreEntity> {
    const orm = DeviceTrustScoreMapper.toPersistence(deviceTrustScore);
    const saved = await this.getRepository(qr).save(orm);
    return DeviceTrustScoreMapper.toDomain(saved);
  }
}
