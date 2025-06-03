import { Logger, RequestMethod, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Environment, ENVIRONMENT_ENV } from '@nz/config';
import { EnvironmentType } from '@nz/const';
import { LOGGER_SERVICE, LoggerService } from '@nz/logger';
import { GrpcToHttpInterceptor } from '@nz/shared-infrastructure';
import { AppModule } from './app/app.module';
import { BootstrapSwagger } from './bootstrap/swagger.bootstrap';

async function Bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });
  const logger = new Logger(Bootstrap.name);
  const loggerService: LoggerService = app.get(LOGGER_SERVICE);

  app.useLogger(loggerService);

  app.useGlobalPipes(new ValidationPipe());

  app.flushLogs();
  const configService = app.get(ConfigService);
  const { port, host, corsOrigins = ['*'] } = configService.getOrThrow<Environment>(ENVIRONMENT_ENV);

  const globalPrefix = configService.get<string>('API_PREFIX') || 'api';

  app.enableCors({
    origin: corsOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    credentials: true,
  });
  app.setGlobalPrefix(globalPrefix, {
    exclude: [{ method: RequestMethod.GET, path: '/health/*path' }],
  });

  app.useGlobalInterceptors(new GrpcToHttpInterceptor());

  const isProduction = configService.getOrThrow<string>('NODE_ENV') === EnvironmentType.Production;

  if (isProduction) {
    app.enableShutdownHooks();
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  } else {
    BootstrapSwagger(app);
  }
  app.disable('x-powered-by');
  await app.listen(port, host);
  logger.log(`🚀 Application is running on: http://${host}:${port}/${globalPrefix}`);
}

Bootstrap();
