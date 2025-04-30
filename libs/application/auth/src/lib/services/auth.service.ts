import { Injectable } from '@nestjs/common';

import { LoginUserUseCase, RegisterUserUseCase } from '../use-cases';

@Injectable()
export class AuthService {
  constructor(private readonly registerUserUseCase: RegisterUserUseCase, private readonly loginUserUseCase: LoginUserUseCase) {}

  public async register(payload: { username: string; email: string; password: string }) {
    return this.registerUserUseCase.execute(payload);
  }

  public async login(payload: { username?: string; email?: string; password: string }) {
    return this.loginUserUseCase.execute(payload);
  }
}
