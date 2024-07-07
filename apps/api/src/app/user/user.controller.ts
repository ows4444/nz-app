import { Controller } from '@nestjs/common';
import { CreateRootUserUseCase } from '@apps/api/src/use-cases/user';

@Controller('users')
export class UserController {
  constructor(private readonly createRootUserUseCase: CreateRootUserUseCase) {
    this.createRootUserUseCase.execute();
  }
}
