import KeyvRedis from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
import { Module, Provider } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedConfigModule, TYPEORM_ENV, TypeOrmEnvironment } from '@nz/config';
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
import Keyv from 'keyv';
import { HealthController } from './health.controller';
import { IdentityController } from './identity.controller';

@Module({
  imports: [
    CqrsModule.forRoot(),
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
