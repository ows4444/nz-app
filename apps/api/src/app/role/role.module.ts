import { Module } from '@nestjs/common';
import RoleUseCases from '@apps/api/src/use-cases/role';
import { RoleController } from './role.controller';

@Module({
  controllers: [RoleController],
  providers: [...RoleUseCases],
})
export class RoleModule {}
