import { Injectable } from '@nestjs/common';
import { UserDeviceEntity } from '@nz/identity-device-domain';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { UserDeviceEntityORM } from '../entities';
import { UserDeviceMapper } from '../mappers';

@Injectable()
export class TypeormUserDeviceRepository {
  private repository: Repository<UserDeviceEntityORM>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(UserDeviceEntityORM);
  }

  private getRepository(queryRunner?: QueryRunner): Repository<UserDeviceEntityORM> {
    return queryRunner ? queryRunner.manager.getRepository(UserDeviceEntityORM) : this.repository;
  }

  async save(userContact: UserDeviceEntity, qr?: QueryRunner): Promise<UserDeviceEntity> {
    const orm = UserDeviceMapper.toPersistence(userContact);
    const saved = await this.getRepository(qr).save(orm);
    return UserDeviceMapper.toDomain(saved);
  }
}
