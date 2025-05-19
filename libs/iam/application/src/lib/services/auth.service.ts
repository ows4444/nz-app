import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { LoginByEmailDto, LoginByUsernameDto, RegisterDto } from '@nz/iam-presentation';
import { LoginByEmailCommand, LoginByUsernameCommand, RegisterCommand } from '../commands';

@Injectable()
export class AuthService {
  constructor(private readonly commandBus: CommandBus) {}

  public async register(payload: RegisterDto) {
    return this.commandBus.execute(new RegisterCommand(payload));
  }
  public async loginByUsername(payload: LoginByUsernameDto) {
    return this.commandBus.execute(new LoginByUsernameCommand(payload));
  }
  public async loginByEmail(payload: LoginByEmailDto) {
    return this.commandBus.execute(new LoginByEmailCommand(payload));
  }
}
