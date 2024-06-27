import { Controller, Post } from '@nestjs/common';
import { CreateRootUserUseCase } from '../use-cases/user/create-root-user.use-case';

@Controller('user')
export class UserController {
  constructor(private readonly createRootUserUseCase: CreateRootUserUseCase) {}

  @Post()
  async createUser(): Promise<boolean> {
    return this.createRootUserUseCase.execute();
  }
}
