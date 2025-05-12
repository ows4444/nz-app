import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegisterCommand } from '../impl';

@CommandHandler(RegisterCommand)
export class RegisterHandler implements ICommandHandler<RegisterCommand> {
  execute({ payload }: RegisterCommand): Promise<any> | any {
    return {
      token: `${payload.username}:${payload.password}:${payload.email}`,
      message: 'Register successful',
    };
  }
}
