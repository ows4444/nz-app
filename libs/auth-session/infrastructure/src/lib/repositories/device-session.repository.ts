import { Injectable } from '@nestjs/common';
import { DeviceSessionEntity } from '@nz/auth-session-domain';
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

  async findOneByDeviceId(deviceId: string, qr?: QueryRunner): Promise<DeviceSessionEntity | null> {
    const orm = await this.getRepository(qr).findOne({ where: { deviceId } });
    return orm ? DeviceSessionMapper.toDomain(orm) : null;
  }

  async findOneByUserId(userId: string, qr?: QueryRunner): Promise<DeviceSessionEntity | null> {
    const orm = await this.getRepository(qr).findOne({ where: { userId } });
    return orm ? DeviceSessionMapper.toDomain(orm) : null;
  }

  async save(DeviceSession: DeviceSessionEntity, qr?: QueryRunner): Promise<DeviceSessionEntity> {
    const orm = DeviceSessionMapper.toPersistence(DeviceSession);
    const saved = await this.getRepository(qr).save(orm);
    return DeviceSessionMapper.toDomain(saved);
  }
}
