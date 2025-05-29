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
  IDENTITY_DEVICE_SERVICE_ENV,
  IdentityDeviceServiceEnvironment,
  identityDeviceServiceEnvLoader,
  SharedConfigModule,
} from '@nz/config';
import { RateLimitInterceptor } from '@nz/shared-infrastructure';
import { authSession, health, identityDevice } from '@nz/shared-proto';
import Keyv from 'keyv';
import { join } from 'path';
import { AuthController } from './auth.controller';
import { HealthController } from './health.controller';
import { IdentityController } from './identity.controller';

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
        name: identityDevice.protobufPackage,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: [identityDevice.IDENTITY_DEVICE_PACKAGE_NAME, health.HEALTH_PACKAGE_NAME],
            protoPath: [protoPath(identityDevice.protobufPackage), protoPath(health.protobufPackage)],
            url: `${configService.getOrThrow<IdentityDeviceServiceEnvironment>(IDENTITY_DEVICE_SERVICE_ENV).host}:${
              configService.getOrThrow<IdentityDeviceServiceEnvironment>(IDENTITY_DEVICE_SERVICE_ENV).port
            }`,
          },
        }),
        imports: [ConfigModule],
        inject: [ConfigService],
      },
    ]),
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
      load: [authSessionServiceEnvLoader, identityDeviceServiceEnvLoader],
    }),
  ],
  controllers: [HealthController, AuthController, IdentityController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: RateLimitInterceptor,
    },
  ],
})
export class AppModule {}
