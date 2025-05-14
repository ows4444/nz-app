import { ConflictException, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { UserContactEntity, UserContactRepository } from '@nz/iam-domain';
import { DataSource, QueryFailedError, QueryRunner } from 'typeorm';
import { UserContactEntityORM } from '../entities/user-contact.entity';
import { UserContactMapper } from '../mappers/user-contact.mapper';

@Injectable()
export class TypeormUserContactRepository implements UserContactRepository {
  private repo(qr?: QueryRunner) {
    return qr ? qr.manager.getRepository(UserContactEntityORM) : this.ds.getRepository(UserContactEntityORM);
  }

  constructor(@InjectDataSource() private readonly ds: DataSource) {}

  async save(user: UserContactEntity, qr?: QueryRunner): Promise<UserContactEntity> {
    const ormEntity = this.repo(qr).create(UserContactMapper.toPersistence(user));
    try {
      const updated = await this.repo(qr).save(ormEntity);
      return UserContactMapper.toDomain(updated);
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (err instanceof QueryFailedError && (err as any).code === 'ER_DUP_ENTRY') {
        throw new ConflictException('User already exists');
      }
      throw err;
    }
  }
  async findOneById(id: string): Promise<UserContactEntity> {
    const ormEntity = await this.repo().findOne({
      where: { id },
      relations: {
        user: true,
      },
    });
    if (!ormEntity) {
      throw new ConflictException('User not found');
    }
    return UserContactMapper.toDomain(ormEntity);
  }
}
