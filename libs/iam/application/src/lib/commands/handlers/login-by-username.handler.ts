import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { auth } from '@nz/shared-proto';
import { LoginByUsernameCommand } from '../impl';

@CommandHandler(LoginByUsernameCommand)
export class LoginByUsernameHandler implements ICommandHandler<LoginByUsernameCommand> {
  async execute({ payload }: LoginByUsernameCommand): Promise<auth.LoginResponse> {
    return {
      token: `${payload.username}:${payload.password}`,
      message: 'Login successful',
    };
  }
}
