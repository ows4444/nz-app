import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SharedConfigModule } from '@nz/config';
import { auth, health } from '@nz/shared-proto';
import { join } from 'path';
import { AuthController } from './auth.controller';
import { HealthController } from './health.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: auth.protobufPackage,
        transport: Transport.GRPC,
        options: {
          package: [auth.AUTH_PACKAGE_NAME, health.HEALTH_PACKAGE_NAME],
          protoPath: [join(__dirname, 'assets', 'auth.proto'), join(__dirname, 'assets', 'health.proto')],
          url: 'localhost:4040',
        },
      },
    ]),

    SharedConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
    }),
  ],
  controllers: [AuthController, HealthController],
})
export class AppModule {}
