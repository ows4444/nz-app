import { Injectable } from '@nestjs/common';
import { UserCredentialEntity } from '@nz/iam-domain';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { UserCredentialEntityORM } from '../entities/user-credential.entity';
import { UserCredentialMapper } from '../mappers';

@Injectable()
export class TypeormUserCredentialRepository {
  private repository: Repository<UserCredentialEntityORM>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(UserCredentialEntityORM);
  }

  private getRepository(queryRunner?: QueryRunner): Repository<UserCredentialEntityORM> {
    return queryRunner ? queryRunner.manager.getRepository(UserCredentialEntityORM) : this.repository;
  }

  async findOneById(id: string, qr?: QueryRunner): Promise<UserCredentialEntity | null> {
    const orm = await this.getRepository(qr).findOne({ where: { id } });
    return orm ? UserCredentialMapper.toDomain(orm) : null;
  }

  async save(userCredential: UserCredentialEntity, qr?: QueryRunner): Promise<UserCredentialEntity> {
    const orm = UserCredentialMapper.toPersistence(userCredential);
    const saved = await this.getRepository(qr).save(orm);
    return UserCredentialMapper.toDomain(saved);
  }
}
