import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { UserAccountRepository } from '@nz/auth-domain';
import { Email, UserAccountEntity, Username } from '@nz/auth-domain';
import { DataSource, QueryFailedError, QueryRunner } from 'typeorm';
import { UserAccountEntityORM } from '../entities/user-account.entity';
import { UserAccountMapper } from '../mappers/user-account.mapper';

@Injectable()
export class TypeormUserAccountRepository implements UserAccountRepository {
  constructor(@InjectDataSource() private readonly ds: DataSource) {}

  private repo(qr?: QueryRunner) {
    return qr ? qr.manager.getRepository(UserAccountEntityORM) : this.ds.getRepository(UserAccountEntityORM);
  }

  async findOneByEmail(email: Email, qr?: QueryRunner): Promise<UserAccountEntity | null> {
    const orm = await this.repo(qr).findOne({ where: { email: email.getValue() } });
    return orm ? UserAccountMapper.toDomain(orm) : null;
  }

  async findOneByUsername(username: Username, qr?: QueryRunner): Promise<UserAccountEntity | null> {
    const orm = await this.repo(qr).findOne({ where: { username: username.getValue() } });
    return orm ? UserAccountMapper.toDomain(orm) : null;
  }

  async findOneByEmailOrUsername(email: Email, username: Username, qr?: QueryRunner): Promise<UserAccountEntity | null> {
    const orm = await this.repo(qr).findOne({
      where: [{ email: email.getValue() }, { username: username.getValue() }],
    });
    return orm ? UserAccountMapper.toDomain(orm) : null;
  }

  async create(user: UserAccountEntity, qr?: QueryRunner): Promise<UserAccountEntity> {
    const ormEntity = this.repo(qr).create(UserAccountMapper.toPersistence(user));
    try {
      const saved = await this.repo(qr).save(ormEntity);
      return UserAccountMapper.toDomain(saved);
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (err instanceof QueryFailedError && (err as any).code === 'ER_DUP_ENTRY') {
        throw new ConflictException('User already exists');
      }
      throw err;
    }
  }

  async findAll(qr?: QueryRunner): Promise<UserAccountEntity[]> {
    const list = await this.repo(qr).find();
    return list.map(UserAccountMapper.toDomain);
  }

  async findOneById(id: string, qr?: QueryRunner): Promise<UserAccountEntity> {
    try {
      const orm = await this.repo(qr).findOneOrFail({ where: { id } });
      return UserAccountMapper.toDomain(orm);
    } catch {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }

  async save(user: UserAccountEntity, qr?: QueryRunner): Promise<UserAccountEntity> {
    const ormEntity = this.repo(qr).create(UserAccountMapper.toPersistence(user));
    try {
      const updated = await this.repo(qr).save(ormEntity);
      return UserAccountMapper.toDomain(updated);
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (err instanceof QueryFailedError && (err as any).code === 'ER_DUP_ENTRY') {
        throw new ConflictException('User already exists');
      }
      throw err;
    }
  }
}
