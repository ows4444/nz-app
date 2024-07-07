import { Module } from '@nestjs/common';
import UserUseCases from '@apps/api/src/use-cases/user';
import { UserController } from './user.controller';

@Module({
  controllers: [UserController],
  providers: [...UserUseCases],
})
export class UserModule {}
