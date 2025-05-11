import { Injectable } from '@nestjs/common';

import { CommandBus } from '@nestjs/cqrs';
import { LoginCommand } from '../commands/impl/login.command';

@Injectable()
export class AuthService {
  constructor(private readonly commandBus: CommandBus) {}

  public async register(payload: { username: string; email: string; password: string }) {
    return this.commandBus.execute(payload);
  }

  public async login(payload: { username: string; password: string }) {
    return this.commandBus.execute(new LoginCommand(payload.username, payload.password));
  }
}
