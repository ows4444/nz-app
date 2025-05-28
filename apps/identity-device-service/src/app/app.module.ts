import KeyvRedis from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedConfigModule, TypeOrmEnvironment } from '@nz/config';
import {
  ContactVerificationEntityORM,
  DeviceEntityORM,
  TypeormContactVerificationRepository,
  TypeormDeviceRepository,
  TypeormUserContactRepository,
  TypeormUserDeviceRepository,
  TypeormUserPreferenceRepository,
  TypeormUserProfileRepository,
  UserContactEntityORM,
  UserDeviceEntityORM,
  UserPreferenceEntityORM,
  UserProfileEntityORM,
} from '@nz/identity-device-infrastructure';
import { GrpcIdempotencyInterceptor, GrpcServerExceptionFilter } from '@nz/shared-infrastructure';
import Keyv from 'keyv';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    CqrsModule.forRoot(),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...configService.getOrThrow<TypeOrmEnvironment>('typeorm'),
        entities: [DeviceEntityORM, UserContactEntityORM, UserDeviceEntityORM, ContactVerificationEntityORM, UserPreferenceEntityORM, UserProfileEntityORM],
      }),
      imports: [ConfigModule],
    }),
    CacheModule.registerAsync({
      useFactory: async () => ({
        stores: [new Keyv({ store: new KeyvRedis('redis://localhost:6379') })],
        isGlobal: true,
      }),
    }),
    SharedConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: GrpcIdempotencyInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: GrpcServerExceptionFilter,
    },
    TypeormContactVerificationRepository,
    TypeormDeviceRepository,
    TypeormUserContactRepository,
    TypeormUserDeviceRepository,
    TypeormUserPreferenceRepository,
    TypeormUserProfileRepository,
  ],
})
export class AppModule {}
