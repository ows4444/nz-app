import { Injectable } from '@nestjs/common';
import { DeviceTrustEventEntity } from '@nz/identity-device-domain';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { DeviceTrustEventEntityORM } from '../entities';
import { DeviceTrustEventMapper } from '../mappers';

@Injectable()
export class TypeormDeviceTrustEventRepository {
  private repository: Repository<DeviceTrustEventEntityORM>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(DeviceTrustEventEntityORM);
  }

  private getRepository(queryRunner?: QueryRunner): Repository<DeviceTrustEventEntityORM> {
    return queryRunner ? queryRunner.manager.getRepository(DeviceTrustEventEntityORM) : this.repository;
  }

  async save(deviceTrustEvent: DeviceTrustEventEntity, qr?: QueryRunner): Promise<DeviceTrustEventEntity> {
    const orm = DeviceTrustEventMapper.toPersistence(deviceTrustEvent);
    const saved = await this.getRepository(qr).save(orm);
    return DeviceTrustEventMapper.toDomain(saved);
  }
}
