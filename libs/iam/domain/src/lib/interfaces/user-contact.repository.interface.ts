import { Inject } from '@nestjs/common';
import { QueryRunner } from 'typeorm';
import { UserContactEntity } from '../entities/user-contact.entity';

export const USER_CONTACT_REPOSITORY = Symbol('USER_CONTACT_REPOSITORY');
export const InjectUserContactRepository = (): PropertyDecorator & ParameterDecorator => Inject(USER_CONTACT_REPOSITORY);

export interface UserContactRepository {
  save(user: UserContactEntity, qr?: QueryRunner): Promise<UserContactEntity>;
  findOneById(id: string): Promise<UserContactEntity>;
}
