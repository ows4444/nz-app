import KeyvRedis from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SharedConfigModule } from '@nz/config';
import { IdempotencyInterceptor, RateLimitInterceptor } from '@nz/shared-infrastructure';
import { auth, health } from '@nz/shared-proto';
import Keyv from 'keyv';
import { join } from 'path';
import { AuthController } from './auth.controller';
import { HealthController } from './health.controller';

const protoPath = (name: string) => join(__dirname, 'assets', `${name}.proto`);
@Module({
  imports: [
    ClientsModule.register([
      {
        name: auth.protobufPackage,
        transport: Transport.GRPC,
        options: {
          package: [auth.AUTH_PACKAGE_NAME, health.HEALTH_PACKAGE_NAME],
          protoPath: [protoPath(auth.protobufPackage), protoPath(health.protobufPackage)],
          url: 'localhost:4040',
        },
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
    }),
  ],
  controllers: [HealthController, AuthController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: IdempotencyInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: RateLimitInterceptor,
    },
  ],
})
export class AppModule {}
