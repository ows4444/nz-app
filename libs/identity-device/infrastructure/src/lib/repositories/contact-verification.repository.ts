import { Injectable } from '@nestjs/common';
import { ContactVerificationEntity } from '@nz/identity-device-domain';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { ContactVerificationEntityORM } from '../entities';
import { ContactVerificationMapper } from '../mappers';

@Injectable()
export class TypeormContactVerificationRepository {
  private repository: Repository<ContactVerificationEntityORM>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(ContactVerificationEntityORM);
  }

  private getRepository(queryRunner?: QueryRunner): Repository<ContactVerificationEntityORM> {
    return queryRunner ? queryRunner.manager.getRepository(ContactVerificationEntityORM) : this.repository;
  }

  async save(userContact: ContactVerificationEntity, qr?: QueryRunner): Promise<ContactVerificationEntity> {
    const orm = ContactVerificationMapper.toPersistence(userContact);
    const saved = await this.getRepository(qr).save(orm);
    return ContactVerificationMapper.toDomain(saved);
  }
}
