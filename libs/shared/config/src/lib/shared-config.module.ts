import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigModuleOptions, ConfigService } from '@nestjs/config';
import { LoggerCoreModule } from '@nz/logger';
import { typeOrmLoader } from './database/typeorm.loader';
import { envLoader, getEnvFile } from './env/env.loader';
import { LOGGER_ENV, LoggerEnvironment } from './logger';
import { loggerLoader } from './logger/logger.loader';
import { rabbitMQLoader } from './rabbitmq';
import { swaggerEnvLoader } from './swagger/swagger.loader';

@Global()
@Module({
  imports: [
    ConfigModule,
    LoggerCoreModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => configService.getOrThrow<LoggerEnvironment>(LOGGER_ENV),
      inject: [ConfigService],
    }),
  ],

  exports: [ConfigModule],
})
export class SharedConfigModule {
  static forRoot(options: ConfigModuleOptions): DynamicModule {
    return {
      module: SharedConfigModule,
      imports: [
        ConfigModule.forRoot({
          ...options,
          isGlobal: options.isGlobal ?? true,
          load: [envLoader, typeOrmLoader, swaggerEnvLoader, loggerLoader, rabbitMQLoader, ...(options.load ?? [])],
          envFilePath: getEnvFile(options.envFilePath),
          validationOptions: {
            allowUnknown: true,
            abortEarly: false,
          },
          cache: options.cache ?? true,
        }),
      ],
      exports: [ConfigModule],
    };
  }
}
