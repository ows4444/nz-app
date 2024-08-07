import { Controller } from '@nestjs/common';
import { CreateRootUserUseCase } from '@apps/api/src/use-cases/user';
import { ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('Users')
export class UserController {
  constructor(private readonly createRootUserUseCase: CreateRootUserUseCase) {}
}
