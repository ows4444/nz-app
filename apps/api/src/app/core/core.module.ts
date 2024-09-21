import { Module } from '@nestjs/common';
import { ComponentController } from './component/component.controller';
import { ThemeController } from './theme/theme.controller';
import ComponentUseCases from '@apps/api/src/use-cases/core/component';
import ThemeUseCases from '@apps/api/src/use-cases/core/theme';
@Module({
  controllers: [ComponentController, ThemeController],
  providers: [...ComponentUseCases, ...ThemeUseCases],
})
export class CoreModule {}
