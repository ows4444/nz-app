import { Injectable } from '@nestjs/common';
import { DeviceEntity } from '@nz/identity-device-domain';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { DeviceEntityORM } from '../entities';
import { DeviceMapper } from '../mappers';

@Injectable()
export class TypeormDeviceRepository {
  private repository: Repository<DeviceEntityORM>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(DeviceEntityORM);
  }

  private getRepository(queryRunner?: QueryRunner): Repository<DeviceEntityORM> {
    return queryRunner ? queryRunner.manager.getRepository(DeviceEntityORM) : this.repository;
  }

  async save(userContact: DeviceEntity, qr?: QueryRunner): Promise<DeviceEntity> {
    const orm = DeviceMapper.toPersistence(userContact);
    const saved = await this.getRepository(qr).save(orm);
    return DeviceMapper.toDomain(saved);
  }
}
