import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { auth } from '@nz/shared-proto';
import { LoginByEmailCommand } from '../impl';

@CommandHandler(LoginByEmailCommand)
export class LoginByEmailHandler implements ICommandHandler<LoginByEmailCommand> {
  async execute({ payload }: LoginByEmailCommand): Promise<auth.LoginResponse> {
    return {
      token: `${payload.email}:${payload.password}`,
      message: 'Login successful',
    };
  }
}
