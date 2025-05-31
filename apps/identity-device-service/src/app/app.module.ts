import KeyvRedis from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
import { Module, Provider } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AUTH_SESSION_SERVICE_ENV, AuthSessionServiceEnvironment, authSessionServiceEnvLoader, Environment, ENVIRONMENT_ENV, SharedConfigModule, TYPEORM_ENV, TypeOrmEnvironment } from '@nz/config';
import { IdentityDeviceCommandHandlers, IdentityService } from '@nz/identity-device-application';
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
import { authSession, health } from '@nz/shared-proto';
import Keyv from 'keyv';
import { GrpcMetadataResolver, I18nModule } from 'nestjs-i18n';
import path from 'path';
import { HealthController } from './health.controller';
import { IdentityController } from './identity.controller';
const protoPath = (name: string) => path.join(__dirname, 'assets', `${name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}.proto`);

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
    ]),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...configService.getOrThrow<TypeOrmEnvironment>(TYPEORM_ENV),
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
      envFilePath: [__dirname],
      load: [authSessionServiceEnvLoader],
    }),
  ],
  controllers: [HealthController, IdentityController],
  providers: ([] as Provider[]).concat(
    [
      IdentityService,
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
    IdentityDeviceCommandHandlers,
  ),
})
export class AppModule {}
