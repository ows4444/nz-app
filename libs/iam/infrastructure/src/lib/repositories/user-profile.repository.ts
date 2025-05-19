import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { UserProfileRepository } from '@nz/iam-domain';
import { Email, Username, UserProfileEntity } from '@nz/iam-domain';
import { DataSource, QueryFailedError, QueryRunner } from 'typeorm';
import { UserProfileEntityORM } from '../entities/user-profile.entity';
import { UserProfileMapper } from '../mappers/user-profile.mapper';

@Injectable()
export class TypeormUserProfileRepository implements UserProfileRepository {
  constructor(@InjectDataSource() private readonly ds: DataSource) {}

  private repo(qr?: QueryRunner) {
    return qr ? qr.manager.getRepository(UserProfileEntityORM) : this.ds.getRepository(UserProfileEntityORM);
  }

  async findOneByEmail(email: Email, qr?: QueryRunner): Promise<UserProfileEntity | null> {
    const orm = await this.repo(qr).findOne({ where: { email: email.getValue() } });
    return orm ? UserProfileMapper.toDomain(orm) : null;
  }

  async findOneByUsername(username: Username, qr?: QueryRunner): Promise<UserProfileEntity | null> {
    const orm = await this.repo(qr).findOne({ where: { username: username.getValue() } });
    return orm ? UserProfileMapper.toDomain(orm) : null;
  }

  async findOneByEmailOrUsername(email: Email, username: Username, qr?: QueryRunner): Promise<UserProfileEntity | null> {
    const orm = await this.repo(qr).findOne({
      where: [{ email: email.getValue() }, { username: username.getValue() }],
    });
    return orm ? UserProfileMapper.toDomain(orm) : null;
  }

  async create(user: UserProfileEntity, qr?: QueryRunner): Promise<UserProfileEntity> {
    const ormEntity = this.repo(qr).create(UserProfileMapper.toPersistence(user));
    try {
      const saved = await this.repo(qr).save(ormEntity);
      return UserProfileMapper.toDomain(saved);
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (err instanceof QueryFailedError && (err as any).code === 'ER_DUP_ENTRY') {
        throw new ConflictException('User already exists');
      }
      throw err;
    }
  }

  async findAll(qr?: QueryRunner): Promise<UserProfileEntity[]> {
    const list = await this.repo(qr).find();
    return list.map(UserProfileMapper.toDomain);
  }

  async findOneById(id: string, qr?: QueryRunner): Promise<UserProfileEntity> {
    try {
      const orm = await this.repo(qr).findOneOrFail({ where: { id } });
      return UserProfileMapper.toDomain(orm);
    } catch {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }

  async save(user: UserProfileEntity, qr?: QueryRunner): Promise<UserProfileEntity> {
    const ormEntity = this.repo(qr).create(UserProfileMapper.toPersistence(user));
    try {
      const updated = await this.repo(qr).save(ormEntity);
      return UserProfileMapper.toDomain(updated);
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (err instanceof QueryFailedError && (err as any).code === 'ER_DUP_ENTRY') {
        throw new ConflictException('User already exists');
      }
      throw err;
    }
  }
}
