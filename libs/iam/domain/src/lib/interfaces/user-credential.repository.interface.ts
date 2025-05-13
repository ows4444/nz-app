import { Inject } from '@nestjs/common';
import { UserCredentialEntity } from '../entities/user-credential.entity';

export const USER_CREDENTIAL_REPOSITORY = Symbol('USER_CREDENTIAL_REPOSITORY');
export const InjectUserCredentialRepository = (): PropertyDecorator & ParameterDecorator => Inject(USER_CREDENTIAL_REPOSITORY);

export interface UserCredentialRepository {
  save(userCredential: UserCredentialEntity): Promise<UserCredentialEntity>;
  findOneById(id: string): Promise<UserCredentialEntity | null>;
}
