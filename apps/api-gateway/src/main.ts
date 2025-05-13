import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestApplication, NestFactory } from '@nestjs/core';
import { Environment } from '@nz/config';
import { EnvironmentType } from '@nz/const';
import { LOGGER_SERVICE, LoggerService } from '@nz/logger';
import { GrpcToHttpInterceptor } from '@nz/shared-infrastructure';
import { AppModule } from './app/app.module';
import { BootstrapSwagger } from './bootstrap/swagger.bootstrap';

async function Bootstrap() {
  const app = await NestFactory.create<NestApplication>(AppModule, {
    bufferLogs: true,
  });
  const logger = new Logger(Bootstrap.name);
  const loggerService: LoggerService = app.get(LOGGER_SERVICE);

  app.useLogger(loggerService);

  app.useGlobalPipes(new ValidationPipe());

  app.flushLogs();
  const configService = app.get(ConfigService);
  const { port, host, corsOrigins = ['*'] } = configService.getOrThrow<Environment>('env');

  const globalPrefix = configService.get<string>('API_PREFIX') || 'api';

  app.enableCors({
    origin: corsOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    credentials: true,
  });
  app.setGlobalPrefix(globalPrefix);

  app.useGlobalInterceptors(new GrpcToHttpInterceptor());

  const isProduction = configService.getOrThrow<string>('NODE_ENV') === EnvironmentType.Production;

  if (isProduction) {
    app.enableShutdownHooks();
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  } else {
    BootstrapSwagger(app);
  }

  await app.listen(port, host);
  logger.log(`🚀 Application is running on: http://${host}:${port}/${globalPrefix}`);
}

Bootstrap();
