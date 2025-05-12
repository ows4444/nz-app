import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginByEmailCommand } from '../impl';

@CommandHandler(LoginByEmailCommand)
export class LoginByEmailHandler implements ICommandHandler<LoginByEmailCommand> {
  execute({ payload }: LoginByEmailCommand): Promise<any> | any {
    return {
      token: `${payload.email}:${payload.password}`,
      message: 'Login successful',
    };
  }
}
