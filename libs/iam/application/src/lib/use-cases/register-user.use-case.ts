import { ConflictException, Injectable } from '@nestjs/common';
import type { UserAccountRepository } from '@nz/iam-domain';
import { Email, InjectUserAccountRepository, UserAccountEntity, Username } from '@nz/iam-domain';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @InjectUserAccountRepository()
    private readonly userAccountRepository: UserAccountRepository,
  ) {}

  async execute(input: { email: string; username: string; password: string }): Promise<UserAccountEntity> {
    const emailVo = Email.create(input.email);
    const usernameVo = Username.create(input.username);

    const existing = await this.userAccountRepository.findOneByEmailOrUsername(emailVo, usernameVo);
    if (existing) {
      throw new ConflictException('User already exists');
    }

    const id = uuidv4();

    const newUser = await UserAccountEntity.createNew(id, usernameVo.getValue(), emailVo.getValue(), input.password, false);

    return this.userAccountRepository.create(newUser);
  }
}
