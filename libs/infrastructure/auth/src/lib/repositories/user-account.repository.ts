import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { UserAccountEntity, UserAccountRepository } from '@nz/domain-auth';
import { DataSource, QueryFailedError, QueryRunner } from 'typeorm';
import { UserAccountEntityORM } from '../entities';
import { UserAccountMapper } from '../mappers/user-account.mapper';

@Injectable()
export class TypeormUserAccountRepository implements UserAccountRepository {
  constructor(@InjectDataSource() private readonly ds: DataSource) {}

  async findOneByEmailOrUsername(email: string, username: string, qr?: QueryRunner): Promise<UserAccountEntity | null> {
    const repo = qr ? qr.manager.getRepository(UserAccountEntityORM) : this.ds.getRepository(UserAccountEntityORM);
    return repo.findOne({ where: [{ email }, { username }] }).then((user) => {
      if (!user) {
        return null;
      }
      return UserAccountMapper.toDomain(user);
    });
  }

  async create(user: UserAccountEntity, qr?: QueryRunner): Promise<UserAccountEntity> {
    const repo = qr ? qr.manager.getRepository(UserAccountEntityORM) : this.ds.getRepository(UserAccountEntityORM);

    const newUser = await repo.save(UserAccountMapper.toPersistence(new UserAccountEntity(user)));
    return UserAccountMapper.toDomain(newUser);
  }

  async findAll(qr?: QueryRunner): Promise<UserAccountEntity[]> {
    const repo = qr ? qr.manager.getRepository(UserAccountEntityORM) : this.ds.getRepository(UserAccountEntityORM);
    return repo.find().then((users) => users.map((user) => UserAccountMapper.toDomain(user)));
  }

  async findOneById(id: string, qr?: QueryRunner): Promise<UserAccountEntity> {
    const repo = qr ? qr.manager.getRepository(UserAccountEntityORM) : this.ds.getRepository(UserAccountEntityORM);
    return repo.findOneBy({ id }).then((user) => {
      if (!user) {
        throw new Error('UserAccount not found');
      }
      return UserAccountMapper.toDomain(user);
    });
  }

  async save(user: UserAccountEntity, qr?: QueryRunner): Promise<UserAccountEntity> {
    try {
      const repo = qr ? qr.manager.getRepository(UserAccountEntityORM) : this.ds.getRepository(UserAccountEntityORM);
      const newUser = await repo.save(UserAccountMapper.toPersistence(user));
      return UserAccountMapper.toDomain(newUser);
    } catch (error) {
      if (error instanceof QueryFailedError && error.message.includes('Duplicate entry')) {
        throw new Error('User already exists');
      }
      throw error;
    }
  }
}
