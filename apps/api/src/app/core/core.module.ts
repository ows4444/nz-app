import { Module } from '@nestjs/common';
import { ComponentController } from './component/component.controller';
import { ThemeController } from './theme/theme.controller';
import CoreUseCases from '@apps/api/src/use-cases/core';
@Module({
  controllers: [ComponentController, ThemeController],
  providers: [...CoreUseCases],
})
export class CoreModule {}
