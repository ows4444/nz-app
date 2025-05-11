import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginCommand } from '../impl/login.command';

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  execute({ password, username }: LoginCommand): Promise<any> | any {
    return {
      token: `${username}:${password}`,
      message: 'Login successful',
    };
  }
}
