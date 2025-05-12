import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import type { UserRepository } from '@nz/iam-domain';
import { Email, InjectUserRepository, UserEntity, Username } from '@nz/iam-domain';
import { GrpcAlreadyExistsException } from '@nz/shared-infrastructure';
import { v4 as uuidv4 } from 'uuid';
import { RegisterCommand } from '../impl';
@CommandHandler(RegisterCommand)
export class RegisterHandler implements ICommandHandler<RegisterCommand> {
  constructor(
    @InjectUserRepository()
    private readonly UserRepository: UserRepository,
  ) {}

  async execute({ payload }: RegisterCommand): Promise<any> {
    const emailVo = Email.create(payload.email);
    const usernameVo = Username.create(payload.username);

    const existing = await this.UserRepository.findOneByEmailOrUsername(emailVo, usernameVo);

    if (existing) {
      throw new GrpcAlreadyExistsException('User already exists');
    }

    const newUser = UserEntity.register(uuidv4(), usernameVo.getValue(), emailVo.getValue(), undefined, 'en-US');

    const user = await this.UserRepository.create(newUser);
    return user;
  }
}
