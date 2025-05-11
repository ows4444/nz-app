import { HttpException, Injectable } from '@nestjs/common';
import type { UserRepository } from '@nz/iam-domain';
import { Email, InjectUserRepository, UserEntity, Username } from '@nz/iam-domain';

@Injectable()
export class LoginUserUseCase {
  constructor(@InjectUserRepository() private readonly UserRepository: UserRepository) {}

  async execute({ email, username }: { email?: string; username?: string; password: string }): Promise<UserEntity> {
    const emailVO = email ? Email.create(email) : undefined;
    // const passwordVO = Password.create(password);
    const usernameVO = username ? Username.create(username) : undefined;

    const user = emailVO ? await this.UserRepository.findOneByEmail(emailVO) : usernameVO ? await this.UserRepository.findOneByUsername(usernameVO) : null;

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    return user;
  }
}
