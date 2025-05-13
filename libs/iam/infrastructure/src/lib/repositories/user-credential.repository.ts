import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { UserCredentialEntity, UserCredentialRepository } from '@nz/iam-domain';
import { DataSource, QueryRunner } from 'typeorm';
import { UserCredentialEntityORM } from '../entities/user-credential.entity';
import { UserCredentialMapper } from '../mappers/user-credential.mapper';

@Injectable()
export class TypeormUserCredentialRepository implements UserCredentialRepository {
  constructor(@InjectDataSource() private readonly ds: DataSource) {}
  private repo(qr?: QueryRunner) {
    return qr ? qr.manager.getRepository(UserCredentialEntityORM) : this.ds.getRepository(UserCredentialEntityORM);
  }

  async save(userCredential: UserCredentialEntity): Promise<UserCredentialEntity> {
    const ormEntity = this.repo().create(UserCredentialMapper.toPersistence(userCredential));
    const saved = await this.repo().save(ormEntity);
    return UserCredentialMapper.toDomain(saved);
  }
  async findOneById(id: string, qr?: QueryRunner): Promise<UserCredentialEntity | null> {
    const doc = await this.repo(qr).findOneOrFail({ where: { id } });
    return doc ? UserCredentialMapper.toDomain(doc) : null;
  }
}
