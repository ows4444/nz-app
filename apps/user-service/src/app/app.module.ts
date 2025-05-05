import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module, Provider } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { APP_FILTER } from '@nestjs/core';
import { RabbitMQEnvironment, SharedConfigModule, TypeOrmEnvironment } from '@nz/config';
import { UserAccountEntityORM } from '@nz/infrastructure-auth';
import { GrpcServerExceptionFilter } from '@nz/shared-infrastructure';
import { AppController } from './app.controller';

@Module({
  imports: [
    CqrsModule.forRoot(),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...configService.getOrThrow<TypeOrmEnvironment>('typeorm'),
        entities: [UserAccountEntityORM],
      }),
      imports: [ConfigModule],
    }),
    SharedConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
    }),
    RabbitMQModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        ...configService.getOrThrow<RabbitMQEnvironment>('rabbitmq'),
      }),
    }),
  ],
  controllers: [AppController],
  providers: ([] as Provider[]).concat([
    {
      provide: APP_FILTER,
      useClass: GrpcServerExceptionFilter,
    },
  ]),
})
export class AppModule {}
