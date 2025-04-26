import { Injectable } from '@nestjs/common';
import type { UserAccountRepository } from '@nz/domain-auth';
import { InjectUserAccountRepository, UserAccountEntity } from '@nz/domain-auth';

@Injectable()
export class AuthService {
  constructor(@InjectUserAccountRepository() private readonly userAccountRepository: UserAccountRepository) {}

  async getUserDetail(id: string): Promise<UserAccountEntity> {
    return await this.userAccountRepository.findOneById(id);
  }

  async getUserList(): Promise<UserAccountEntity[]> {
    return await this.userAccountRepository.findAll();
  }

  async createUser(user: Pick<UserAccountEntity, 'id' | 'username' | 'email' | 'passwordHash' | 'emailVerified'>): Promise<UserAccountEntity> {
    const userExists = await this.userAccountRepository.findOneByEmailOrUsername(user.email, user.username);

    if (userExists) {
      throw new Error('User already exists');
    }

    return await this.userAccountRepository.create(user);
  }
}
