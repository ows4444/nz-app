import { Injectable } from '@nestjs/common';
import { Email, Username, UserProfileEntity } from '@nz/iam-domain';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { UserProfileEntityORM } from '../entities/user-profile.entity';
import { UserProfileMapper } from '../mappers/user-profile.mapper';

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

  async findOneByEmailOrUsername(email: Email, username: Username, qr?: QueryRunner): Promise<UserProfileEntity | null> {
    const orm = await this.getRepository(qr).findOne({
      where: [{ email: email.getValue() }, { username: username.getValue() }],
    });
    return orm ? UserProfileMapper.toDomain(orm) : null;
  }

  async findOneByEmail(email: Email, qr?: QueryRunner): Promise<UserProfileEntity | null> {
    const orm = await this.getRepository(qr).findOne({ where: { email: email.getValue() } });
    return orm ? UserProfileMapper.toDomain(orm) : null;
  }

  async findOneByUsername(username: Username, qr?: QueryRunner): Promise<UserProfileEntity | null> {
    const orm = await this.getRepository(qr).findOne({ where: { username: username.getValue() } });
    return orm ? UserProfileMapper.toDomain(orm) : null;
  }

  async save(user: UserProfileEntity, qr?: QueryRunner): Promise<UserProfileEntity> {
    const orm = UserProfileMapper.toPersistence(user);
    const saved = await this.getRepository(qr).save(orm);
    return UserProfileMapper.toDomain(saved);
  }
}
