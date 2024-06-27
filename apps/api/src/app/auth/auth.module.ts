import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { CreateRootUserUseCase } from './use-cases/user/create-root-user.use-case';

@Module({
  controllers: [UserController],
  providers: [CreateRootUserUseCase],
})
export class AuthModule {}
