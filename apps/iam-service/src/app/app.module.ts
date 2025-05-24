import KeyvRedis from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
import { Module, Provider } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { authConfigLoader, SharedConfigModule, TypeOrmEnvironment } from '@nz/config';
import { AuthService, IAMCommandHandlers } from '@nz/iam-application';
import {
  LoginAttemptEntityORM,
  PasswordResetEntityORM,
  TypeormLoginAttemptRepository,
  TypeormUserContactRepository,
  TypeormUserCredentialRepository,
  TypeormUserProfileRepository,
  UserContactEntityORM,
  UserCredentialEntityORM,
  UserProfileEntityORM,
} from '@nz/iam-infrastructure';
import { GrpcIdempotencyInterceptor, GrpcServerExceptionFilter } from '@nz/shared-infrastructure';
import Keyv from 'keyv';
import { AuthController } from './auth.controller';
import { HealthController } from './health.controller';

@Module({
  imports: [
    CqrsModule.forRoot(),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...configService.getOrThrow<TypeOrmEnvironment>('typeorm'),
        entities: [UserProfileEntityORM, UserContactEntityORM, UserCredentialEntityORM, LoginAttemptEntityORM, PasswordResetEntityORM],
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
  controllers: [AuthController, HealthController],
  providers: ([] as Provider[]).concat(
    [
      {
        provide: APP_INTERCEPTOR,
        useClass: GrpcIdempotencyInterceptor,
      },
      AuthService,
      {
        provide: APP_FILTER,
        useClass: GrpcServerExceptionFilter,
      },
      TypeormUserProfileRepository,
      TypeormUserContactRepository,
      TypeormUserCredentialRepository,
      TypeormLoginAttemptRepository,
    ],
    IAMCommandHandlers,
  ),
})
export class AppModule {}
