import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { UserRepository } from '@nz/iam-domain';
import { Email, UserEntity, Username } from '@nz/iam-domain';
import { DataSource, QueryFailedError, QueryRunner } from 'typeorm';
import { UserEntityORM } from '../entities/user.entity';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class TypeormUserRepository implements UserRepository {
  constructor(@InjectDataSource() private readonly ds: DataSource) {}

  private repo(qr?: QueryRunner) {
    return qr ? qr.manager.getRepository(UserEntityORM) : this.ds.getRepository(UserEntityORM);
  }

  async findOneByEmail(email: Email, qr?: QueryRunner): Promise<UserEntity | null> {
    const orm = await this.repo(qr).findOne({ where: { email: email.getValue() } });
    return orm ? UserMapper.toDomain(orm) : null;
  }

  async findOneByUsername(username: Username, qr?: QueryRunner): Promise<UserEntity | null> {
    const orm = await this.repo(qr).findOne({ where: { username: username.getValue() } });
    return orm ? UserMapper.toDomain(orm) : null;
  }

  async findOneByEmailOrUsername(email: Email, username: Username, qr?: QueryRunner): Promise<UserEntity | null> {
    const orm = await this.repo(qr).findOne({
      where: [{ email: email.getValue() }, { username: username.getValue() }],
    });
    return orm ? UserMapper.toDomain(orm) : null;
  }

  async create(user: UserEntity, qr?: QueryRunner): Promise<UserEntity> {
    const ormEntity = this.repo(qr).create(UserMapper.toPersistence(user));
    try {
      const saved = await this.repo(qr).save(ormEntity);
      return UserMapper.toDomain(saved);
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (err instanceof QueryFailedError && (err as any).code === 'ER_DUP_ENTRY') {
        throw new ConflictException('User already exists');
      }
      throw err;
    }
  }

  async findAll(qr?: QueryRunner): Promise<UserEntity[]> {
    const list = await this.repo(qr).find();
    return list.map(UserMapper.toDomain);
  }

  async findOneById(id: string, qr?: QueryRunner): Promise<UserEntity> {
    try {
      const orm = await this.repo(qr).findOneOrFail({ where: { id } });
      return UserMapper.toDomain(orm);
    } catch {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }

  async save(user: UserEntity, qr?: QueryRunner): Promise<UserEntity> {
    const ormEntity = this.repo(qr).create(UserMapper.toPersistence(user));
    try {
      const updated = await this.repo(qr).save(ormEntity);
      return UserMapper.toDomain(updated);
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (err instanceof QueryFailedError && (err as any).code === 'ER_DUP_ENTRY') {
        throw new ConflictException('User already exists');
      }
      throw err;
    }
  }
}
