import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { RegisterCredentialDto } from '@nz/auth-session-presentation';
import { RegisterCredentialCommand } from '../commands';

@Injectable()
export class AuthService {
  constructor(private readonly commandBus: CommandBus) {}

  public async registerCredential(payload: RegisterCredentialDto) {
    return this.commandBus.execute(new RegisterCredentialCommand(payload));
  }
}
