import KeyvRedis from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  AUTH_SESSION_SERVICE_ENV,
  AuthSessionServiceEnvironment,
  authSessionServiceEnvLoader,
  Environment,
  ENVIRONMENT_ENV,
  SharedConfigModule,
  USER_DEVICE_SERVICE_ENV,
  UserDeviceServiceEnvironment,
  userDeviceServiceEnvLoader,
} from '@nz/config';
import { RateLimitInterceptor } from '@nz/shared-infrastructure';
import { authSession, health, userDevice } from '@nz/shared-proto';
import Keyv from 'keyv';
import { AcceptLanguageResolver, I18nModule, I18nOptionsWithoutResolvers, QueryResolver } from 'nestjs-i18n';
import path, { join } from 'path';
import { AuthController } from './auth.controller';
import { HealthController } from './health.controller';
import { UserController } from './user.controller';

const protoPath = (name: string) => join(__dirname, 'assets', `${name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}.proto`);
@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: authSession.protobufPackage,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: [authSession.AUTH_SESSION_PACKAGE_NAME, health.HEALTH_PACKAGE_NAME],
            protoPath: [protoPath(authSession.protobufPackage), protoPath(health.protobufPackage)],
            url: `${configService.getOrThrow<AuthSessionServiceEnvironment>(AUTH_SESSION_SERVICE_ENV).host}:${configService.getOrThrow<AuthSessionServiceEnvironment>(AUTH_SESSION_SERVICE_ENV).port}`,
          },
        }),
        imports: [ConfigModule],
        inject: [ConfigService],
      },
      {
        name: userDevice.protobufPackage,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: [userDevice.USER_DEVICE_PACKAGE_NAME, health.HEALTH_PACKAGE_NAME],
            protoPath: [protoPath(userDevice.protobufPackage), protoPath(health.protobufPackage)],
            url: `${configService.getOrThrow<UserDeviceServiceEnvironment>(USER_DEVICE_SERVICE_ENV).host}:${configService.getOrThrow<UserDeviceServiceEnvironment>(USER_DEVICE_SERVICE_ENV).port}`,
          },
        }),
        imports: [ConfigModule],
        inject: [ConfigService],
      },
    ]),
    I18nModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): I18nOptionsWithoutResolvers => {
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
      resolvers: [AcceptLanguageResolver, { use: QueryResolver, options: ['lang', 'locale'] }],
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
      load: [authSessionServiceEnvLoader, userDeviceServiceEnvLoader],
    }),
  ],
  controllers: [HealthController, AuthController, UserController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: RateLimitInterceptor,
    },
  ],
})
export class AppModule {}
