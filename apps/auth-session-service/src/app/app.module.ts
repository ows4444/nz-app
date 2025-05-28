import KeyvRedis from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  DeviceSessionEntityORM,
  LoginAttemptEntityORM,
  PasswordResetEntityORM,
  SessionPolicyEntityORM,
  TypeormDeviceSessionRepository,
  TypeormLoginAttemptRepository,
  TypeormPasswordResetRepository,
  TypeormUserCredentialRepository,
  TypeormUserPasswordHistoryRepository,
  UserCredentialEntityORM,
  UserPasswordHistoryEntityORM,
} from '@nz/auth-session-infrastructure';
import { authConfigLoader, SharedConfigModule, TypeOrmEnvironment } from '@nz/config';
import { GrpcIdempotencyInterceptor, GrpcServerExceptionFilter } from '@nz/shared-infrastructure';
import Keyv from 'keyv';
import { HealthController } from './health.controller';
@Module({
  imports: [
    CqrsModule.forRoot(),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...configService.getOrThrow<TypeOrmEnvironment>('typeorm'),
        entities: [DeviceSessionEntityORM, LoginAttemptEntityORM, PasswordResetEntityORM, SessionPolicyEntityORM, UserCredentialEntityORM, UserPasswordHistoryEntityORM],
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
      load: [authConfigLoader],
    }),
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: GrpcIdempotencyInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: GrpcServerExceptionFilter,
    },
    TypeormDeviceSessionRepository,
    TypeormLoginAttemptRepository,
    TypeormPasswordResetRepository,
    TypeormUserCredentialRepository,
    TypeormUserPasswordHistoryRepository,
  ],
})
export class AppModule {}
