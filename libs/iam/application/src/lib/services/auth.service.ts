import { Injectable } from '@nestjs/common';

import { CommandBus } from '@nestjs/cqrs';
import { LoginByEmailDto } from '@nz/iam-presentation';
import { LoginByEmailCommand, LoginByUsernameCommand } from '../commands';

@Injectable()
export class AuthService {
  constructor(private readonly commandBus: CommandBus) {}

  public async register(payload: { username: string; email: string; password: string }) {
    return this.commandBus.execute(payload);
  }
  public async loginByUsername(payload: { username: string; password: string }) {
    return this.commandBus.execute(new LoginByUsernameCommand(payload));
  }
  public async loginByEmail(payload: LoginByEmailDto) {
    return this.commandBus.execute(new LoginByEmailCommand(payload));
  }
}
