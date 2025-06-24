import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Environment, ENVIRONMENT_ENV, SharedConfigModule, TYPEORM_ENV, TypeOrmEnvironment } from '@nz/config';
import { GrpcMetadataResolver, I18nModule } from 'nestjs-i18n';
import path from 'path';
import { ESMController } from './esm.controller';
import { HealthController } from './health.controller';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    CqrsModule.forRoot(),
    I18nModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isProd = configService.getOrThrow<Environment>(ENVIRONMENT_ENV).isProduction;
        const baseConfig = {
          fallbackLanguage: 'en',
          loaderOptions: {
            path: path.join(__dirname, 'assets/i18n'),
            watch: true,
          },
        };
        return isProd
          ? baseConfig
          : {
              ...baseConfig,
              typesOutputPath: path.join('libs/shared/i18n/src/lib/shared-i18n.ts'),
            };
      },
      resolvers: [GrpcMetadataResolver],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...configService.getOrThrow<TypeOrmEnvironment>(TYPEORM_ENV),
        entities: [],
      }),
      imports: [ConfigModule],
    }),
    SharedConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      envFilePath: [__dirname],
    }),
    RabbitMQModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        exchanges: [
          {
            name: 'events',
            type: 'topic',
            options: {
              durable: true,
            },
          },
        ],
        queues: [
          {
            name: `${configService.getOrThrow<Environment>(ENVIRONMENT_ENV).appName}.events`,
            exchange: 'events',
            routingKey: configService.getOrThrow<Environment>(ENVIRONMENT_ENV).appName,
            options: {
              durable: true,
            },
          },
        ],
        uri: 'amqp://guest:guest@localhost:5672',
        connectionInitOptions: { wait: false },
        enableControllerDiscovery: true,
      }),
    }),
  ],
  controllers: [HealthController, ESMController],
  providers: [],
})
export class AppModule {}
