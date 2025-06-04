import { Injectable } from '@nestjs/common';
import { UserProfileEntity } from '@nz/identity-device-domain';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { UserProfileEntityORM } from '../entities';
import { UserProfileMapper } from '../mappers';

@Injectable()
export class TypeormUserProfileRepository {
  private repository: Repository<UserProfileEntityORM>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(UserProfileEntityORM);
  }
  private getRepository(queryRunner?: QueryRunner): Repository<UserProfileEntityORM> {
    return queryRunner ? queryRunner.manager.getRepository(UserProfileEntityORM) : this.repository;
  }

  async findOneById(id: string, qr?: QueryRunner): Promise<UserProfileEntity | null> {
    const orm = await this.getRepository(qr).findOne({ where: { id } });
    return orm ? UserProfileMapper.toDomain(orm) : null;
  }

  async save(user: UserProfileEntity, qr?: QueryRunner): Promise<UserProfileEntity> {
    const orm = UserProfileMapper.toPersistence(user);
    const saved = await this.getRepository(qr).save(orm);
    return UserProfileMapper.toDomain(saved);
  }
}
