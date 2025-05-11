import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AsyncMicroserviceOptions, Transport } from '@nestjs/microservices';
import { Environment } from '@nz/config';
import { LOGGER_SERVICE, LoggerService } from '@nz/logger';
import { join } from 'path';
import { AppModule } from './app/app.module';
import { AUTH_PACKAGE_NAME } from './proto/auth';

async function Bootstrap() {
  const app = await NestFactory.createMicroservice<AsyncMicroserviceOptions>(AppModule, {
    useFactory: (configService: ConfigService) => ({
      transport: Transport.GRPC,
      options: {
        package: AUTH_PACKAGE_NAME,
        protoPath: join(__dirname, 'assets', 'auth.proto'),
        url: configService.getOrThrow<Environment>('env').url,
      },
    }),

    inject: [ConfigService],
  });

  const logger = new Logger(Bootstrap.name);
  const loggerService: LoggerService = app.get(LOGGER_SERVICE);

  app.useLogger(loggerService);

  app.useGlobalPipes(new ValidationPipe());

  app.flushLogs();

  app.enableShutdownHooks();

  const config: ConfigService = app.get(ConfigService);

  await app.listen();

  logger.log(`🚀 IAM Service is running...  on Grpc Channel ${config.getOrThrow<Environment>('env').url}`);
}

Bootstrap();
