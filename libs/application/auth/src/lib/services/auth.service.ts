import { Injectable } from '@nestjs/common';
import { RegisterUserDto } from '../dtos';
import { RegisterUserUseCase } from '../use-cases/register-user.use-case';

@Injectable()
export class AuthService {
  constructor(private readonly registerUserUseCase: RegisterUserUseCase) {}

  public async register(payload: RegisterUserDto) {
    return this.registerUserUseCase.execute({
      ...payload,
      passwordHash: payload.password,
    });
  }
}
