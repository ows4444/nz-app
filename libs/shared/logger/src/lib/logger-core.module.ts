import { DynamicModule, Global, Module, Provider, Type } from '@nestjs/common';

import { LOGGER_OPTIONS, LOGGER_SERVICE } from './logger.constants';
import { LoggerModuleAsyncOptions, LoggerModuleFactory, LoggerModuleOptions } from './logger.interfaces';
import { LoggerService } from './logger.service';
import { createLoggerService } from './logger.utils';

@Global()
@Module({})
export class LoggerCoreModule {
  static forRoot(options: LoggerModuleOptions): DynamicModule {
    const loggerProvider: Provider = {
      provide: LOGGER_SERVICE,
      useFactory: () => this.createLoggerFactory(options),
    };
    return {
      module: LoggerCoreModule,
      providers: [loggerProvider],
      exports: [loggerProvider],
    };
  }

  static forRootAsync(options: LoggerModuleAsyncOptions): DynamicModule {
    const provider: Provider = {
      inject: [LOGGER_OPTIONS],
      provide: LOGGER_SERVICE,
      useFactory: (options: LoggerModuleOptions) => createLoggerService(options),
    };

    return {
      module: LoggerCoreModule,
      imports: options.imports,
      providers: [...this.createAsyncProviders(options), provider],
      exports: [provider],
    };
  }

  private static createLoggerFactory(options: LoggerModuleOptions): LoggerService {
    return new LoggerService(options);
  }

  private static createAsyncProviders(options: LoggerModuleAsyncOptions): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }

    const useClass = options.useClass as Type<LoggerModuleFactory>;

    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: useClass,
        useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(options: LoggerModuleAsyncOptions): Provider {
    if (options.useFactory) {
      return {
        provide: LOGGER_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject ?? [],
      };
    }

    const inject = [(options.useClass ?? options.useExisting) as Type<LoggerModuleFactory>];

    return {
      provide: LOGGER_OPTIONS,
      useFactory: async (optionsFactory: LoggerModuleFactory) => await optionsFactory.createLoggerOptions(),
      inject,
    };
  }
}
