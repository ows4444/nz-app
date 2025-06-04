import { Injectable } from '@nestjs/common';
import { DeviceSessionEntity } from '@nz/identity-device-domain';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { DeviceSessionEntityORM } from '../entities';
import { DeviceSessionMapper } from '../mappers';

@Injectable()
export class TypeormDeviceSessionRepository {
  private repository: Repository<DeviceSessionEntityORM>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(DeviceSessionEntityORM);
  }

  private getRepository(queryRunner?: QueryRunner): Repository<DeviceSessionEntityORM> {
    return queryRunner ? queryRunner.manager.getRepository(DeviceSessionEntityORM) : this.repository;
  }

  async save(userContact: DeviceSessionEntity, qr?: QueryRunner): Promise<DeviceSessionEntity> {
    const orm = DeviceSessionMapper.toPersistence(userContact);
    const saved = await this.getRepository(qr).save(orm);
    return DeviceSessionMapper.toDomain(saved);
  }
}
