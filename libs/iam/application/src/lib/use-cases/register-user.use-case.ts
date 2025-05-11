import { ConflictException, Injectable } from '@nestjs/common';
import type { UserRepository } from '@nz/iam-domain';
import { Email, InjectUserRepository, UserEntity, Username } from '@nz/iam-domain';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @InjectUserRepository()
    private readonly UserRepository: UserRepository,
  ) {}

  async execute(input: { email: string; username: string; password: string }): Promise<UserEntity> {
    const emailVo = Email.create(input.email);
    const usernameVo = Username.create(input.username);

    const existing = await this.UserRepository.findOneByEmailOrUsername(emailVo, usernameVo);
    if (existing) {
      throw new ConflictException('User already exists');
    }

    const id = uuidv4();

    const newUser = UserEntity.register(id, usernameVo.getValue(), emailVo.getValue(), undefined, 'en-US');

    return this.UserRepository.create(newUser);
  }
}
