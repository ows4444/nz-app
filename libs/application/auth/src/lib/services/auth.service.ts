import { Injectable } from '@nestjs/common';

import { RegisterUserUseCase } from '../use-cases/register-user.use-case';

@Injectable()
export class AuthService {
  constructor(private readonly registerUserUseCase: RegisterUserUseCase) {}

  public async register(payload: { username: string; email: string; password: string }) {
    return this.registerUserUseCase.execute(payload);
  }
}
