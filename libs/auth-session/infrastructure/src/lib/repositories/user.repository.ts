import { Injectable } from '@nestjs/common';
import { Email, UserEntity, Username } from '@nz/auth-session-domain';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { UserEntityORM } from '../entities';
import { UserMapper } from '../mappers';

@Injectable()
export class TypeormUserRepository {
  private repository: Repository<UserEntityORM>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(UserEntityORM);
  }
  private getRepository(queryRunner?: QueryRunner): Repository<UserEntityORM> {
    return queryRunner ? queryRunner.manager.getRepository(UserEntityORM) : this.repository;
  }

  async findOneById(id: string, qr?: QueryRunner): Promise<UserEntity | null> {
    const orm = await this.getRepository(qr).findOne({ where: { id } });
    return orm ? UserMapper.toDomain(orm) : null;
  }

  async findOneByEmailOrUsername(email: Email, username: Username, qr?: QueryRunner): Promise<UserEntity | null> {
    const orm = await this.getRepository(qr).findOne({
      where: [{ email: email.getValue() }, { username: username.getValue() }],
    });
    return orm ? UserMapper.toDomain(orm) : null;
  }

  async findOneByEmail(email: Email, qr?: QueryRunner): Promise<UserEntity | null> {
    const orm = await this.getRepository(qr).findOne({ where: { email: email.getValue() } });
    return orm ? UserMapper.toDomain(orm) : null;
  }

  async findOneByUsername(username: Username, qr?: QueryRunner): Promise<UserEntity | null> {
    const orm = await this.getRepository(qr).findOne({ where: { username: username.getValue() } });
    return orm ? UserMapper.toDomain(orm) : null;
  }

  async save(user: UserEntity, qr?: QueryRunner): Promise<UserEntity> {
    const orm = UserMapper.toPersistence(user);
    const saved = await this.getRepository(qr).save(orm);
    return UserMapper.toDomain(saved);
  }
}
