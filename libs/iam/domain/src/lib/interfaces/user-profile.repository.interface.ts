import { Inject } from '@nestjs/common';
import { QueryRunner } from 'typeorm';
import { UserProfileEntity } from '../entities';
import { Email, Username } from '../value-objects';

export const USER_PROFILE_REPOSITORY = Symbol('USER_PROFILE_REPOSITORY');
export const InjectUserProfileRepository = (): PropertyDecorator & ParameterDecorator => Inject(USER_PROFILE_REPOSITORY);

export interface UserProfileRepository {
  save(user: UserProfileEntity, qr?: QueryRunner): Promise<UserProfileEntity>;
  findOneById(id: string): Promise<UserProfileEntity>;
  findOneByEmailOrUsername(email: Email, username: Username): Promise<UserProfileEntity | null>;
  findOneByEmail(email: Email): Promise<UserProfileEntity | null>;
  findOneByUsername(username: Username): Promise<UserProfileEntity | null>;
  findAll(): Promise<UserProfileEntity[]>;
}
