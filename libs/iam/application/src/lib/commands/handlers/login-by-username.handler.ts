import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginByUsernameCommand } from '../impl';

@CommandHandler(LoginByUsernameCommand)
export class LoginByUsernameHandler implements ICommandHandler<LoginByUsernameCommand> {
  execute({ payload }: LoginByUsernameCommand): Promise<any> | any {
    return {
      token: `${payload.username}:${payload.password}`,
      message: 'Login successful',
    };
  }
}
