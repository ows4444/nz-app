import KeyvRedis from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
import { Module, Provider } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService, AuthSessionCommandHandlers, AuthSessionQueryHandlers } from '@nz/auth-session-application';
import {
  LoginAttemptEntityORM,
  PasswordResetEntityORM,
  SessionPolicyEntityORM,
  TypeormLoginAttemptRepository,
  TypeormPasswordResetRepository,
  TypeormUserCredentialRepository,
  TypeormUserPasswordHistoryRepository,
  TypeormUserRepository,
  TypeormUserSessionRepository,
  UserCredentialEntityORM,
  UserEntityORM,
  UserPasswordHistoryEntityORM,
  UserSessionEntityORM,
} from '@nz/auth-session-infrastructure';
import { authConfigLoader, Environment, ENVIRONMENT_ENV, SharedConfigModule, TYPEORM_ENV, TypeOrmEnvironment } from '@nz/config';
import { GrpcIdempotencyInterceptor, GrpcServerExceptionFilter, InboxEventEntityORM, OutboxEventEntityORM, TypeormInboxEventRepository, TypeormOutboxEventRepository } from '@nz/shared-infrastructure';
import Keyv from 'keyv';
import { GrpcMetadataResolver, I18nModule } from 'nestjs-i18n';
import path from 'path';
import { AuthController } from './auth.controller';
import { HealthController } from './health.controller';

@Module({
  imports: [
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
        entities: [
          UserEntityORM,
          UserSessionEntityORM,
          LoginAttemptEntityORM,
          PasswordResetEntityORM,
          SessionPolicyEntityORM,
          UserCredentialEntityORM,
          UserPasswordHistoryEntityORM,
          InboxEventEntityORM,
          OutboxEventEntityORM,
        ],
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
      envFilePath: [__dirname],
      load: [authConfigLoader],
    }),
  ],
  controllers: [HealthController, AuthController],
  providers: ([] as Provider[]).concat(
    [
      AuthService,
      {
        provide: APP_INTERCEPTOR,
        useClass: GrpcIdempotencyInterceptor,
      },
      {
        provide: APP_FILTER,
        useClass: GrpcServerExceptionFilter,
      },
      TypeormUserRepository,
      TypeormUserSessionRepository,
      TypeormLoginAttemptRepository,
      TypeormPasswordResetRepository,
      TypeormUserCredentialRepository,
      TypeormUserPasswordHistoryRepository,
      TypeormInboxEventRepository,
      TypeormOutboxEventRepository,
    ],
    AuthSessionCommandHandlers,
    AuthSessionQueryHandlers,
  ),
})
export class AppModule {}
