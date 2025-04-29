import { HttpException, Injectable } from '@nestjs/common';
import type { UserAccountRepository } from '@nz/domain-auth';
import { InjectUserAccountRepository, UserAccountEntity } from '@nz/domain-auth';

@Injectable()
export class RegisterUserUseCase {
  constructor(@InjectUserAccountRepository() private readonly userAccountRepository: UserAccountRepository) {}

  async execute(user: Pick<UserAccountEntity, 'username' | 'email' | 'passwordHash'>): Promise<UserAccountEntity> {
    const userExists = await this.userAccountRepository.findOneByEmailOrUsername(user.email, user.username);

    if (userExists) {
      throw new HttpException('User already exists', 409);
    }

    return await this.userAccountRepository.create(user);
  }
}
