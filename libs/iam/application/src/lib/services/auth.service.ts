import { Injectable } from '@nestjs/common';

import { CommandBus, QueryBus } from '@nestjs/cqrs';

@Injectable()
export class AuthService {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  public async register(payload: { username: string; email: string; password: string }) {
    return this.commandBus.execute(payload);
  }

  public async login(payload: { username?: string; email?: string; password: string }) {
    return this.queryBus.execute(payload);
  }
}
