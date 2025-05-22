import { Injectable } from '@nestjs/common';
import { UserContactEntity } from '@nz/iam-domain';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { UserContactEntityORM } from '../entities';
import { UserContactMapper } from '../mappers/user-contact.mapper';

@Injectable()
export class TypeormUserContactRepository {
  private repository: Repository<UserContactEntityORM>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(UserContactEntityORM);
  }

  private getRepository(queryRunner?: QueryRunner): Repository<UserContactEntityORM> {
    return queryRunner ? queryRunner.manager.getRepository(UserContactEntityORM) : this.repository;
  }

  async save(userContact: UserContactEntity, qr?: QueryRunner): Promise<UserContactEntity> {
    const orm = UserContactMapper.toPersistence(userContact);
    const saved = await this.getRepository(qr).save(orm);
    return UserContactMapper.toDomain(saved);
  }
}
