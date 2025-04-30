import { HttpException, Injectable } from '@nestjs/common';
import type { UserAccountRepository } from '@nz/domain-auth';
import { Email, InjectUserAccountRepository, Password, UserAccountEntity, Username } from '@nz/domain-auth';

@Injectable()
export class LoginUserUseCase {
  constructor(@InjectUserAccountRepository() private readonly userAccountRepository: UserAccountRepository) {}

  async execute({ email, username, password }: { email?: string; username?: string; password: string }): Promise<UserAccountEntity> {
    const emailVO = email ? Email.create(email) : undefined;
    const passwordVO = Password.create(password);
    const usernameVO = username ? Username.create(username) : undefined;

    const user = emailVO ? await this.userAccountRepository.findOneByEmail(emailVO) : usernameVO ? await this.userAccountRepository.findOneByUsername(usernameVO) : null;

    if (!user || !(await user.validatePassword(passwordVO.getValue()))) {
      throw new HttpException(!user ? 'User not found' : 'Invalid password', !user ? 404 : 401);
    }

    return user;
  }
}
