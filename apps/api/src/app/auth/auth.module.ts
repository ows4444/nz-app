import { Module } from '@nestjs/common';
import UserUseCases from '@apps/api/src/use-cases/user';
import { AuthController } from './auth.controller';

@Module({
  controllers: [AuthController],
  providers: [...UserUseCases],
})
export class AuthModule {}
