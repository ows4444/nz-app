import { DynamicModule, Module } from '@nestjs/common';
import { LoggerCoreModule } from './logger-core.module';
import { LoggerModuleAsyncOptions, LoggerModuleOptions } from './logger.interfaces';

@Module({})
export class LoggerModule {
  static forRoot(options: LoggerModuleOptions): DynamicModule {
    return {
      module: LoggerModule,
      imports: [LoggerCoreModule.forRoot(options)],
      exports: [LoggerCoreModule],
    };
  }

  static forRootAsync(options: LoggerModuleAsyncOptions): DynamicModule {
    return {
      module: LoggerModule,
      imports: [LoggerCoreModule.forRootAsync(options)],
      exports: [LoggerCoreModule],
    };
  }
}
