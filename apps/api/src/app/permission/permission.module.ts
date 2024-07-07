import { Module } from '@nestjs/common';
import PermissionUseCases from '@apps/api/src/use-cases/permission';
import { PermissionController } from './permission.controller';

@Module({
  controllers: [PermissionController],
  providers: [...PermissionUseCases],
})
export class PermissionModule {}
