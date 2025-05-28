import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AsyncMicroserviceOptions, Transport } from '@nestjs/microservices';
import { Environment } from '@nz/config';
import { EnvironmentType } from '@nz/const';
import { LOGGER_SERVICE, LoggerService } from '@nz/logger';
import { health, identity } from '@nz/shared-proto';
import { join } from 'path';
import { AppModule } from './app/app.module';

async function Bootstrap() {
  const app = await NestFactory.createMicroservice<AsyncMicroserviceOptions>(AppModule, {
    bufferLogs: true,
    useFactory: (configService: ConfigService) => ({
      transport: Transport.GRPC,
      options: {
        package: [identity.IDENTITY_PACKAGE_NAME, health.HEALTH_PACKAGE_NAME],
        protoPath: [join(__dirname, 'assets', 'identity.proto'), join(__dirname, 'assets', 'health.proto')],
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
  const config: ConfigService = app.get(ConfigService);
  const isProduction = config.getOrThrow<string>('NODE_ENV') === EnvironmentType.Production;
  if (isProduction) {
    app.enableShutdownHooks();
  }

  await app.listen();

  logger.log(`🚀 Identity-Device Service is running. on Grpc ${config.getOrThrow<Environment>('env').url}`);
}

Bootstrap();
