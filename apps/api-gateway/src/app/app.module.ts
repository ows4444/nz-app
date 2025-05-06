import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RabbitMQEnvironment, SharedConfigModule } from '@nz/config';
import { join } from 'path';
import { AUTH_PACKAGE_NAME } from '../proto/auth';
import { USER_PACKAGE_NAME } from '../proto/user';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: AUTH_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          package: AUTH_PACKAGE_NAME,
          protoPath: join(__dirname, 'assets', 'auth.proto'),
          url: 'localhost:8000',
        },
      },
      {
        name: USER_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          package: USER_PACKAGE_NAME,
          protoPath: join(__dirname, 'assets', 'user.proto'),
          url: 'localhost:8001',
        },
      },
    ]),

    SharedConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
    }),

    RabbitMQModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        ...configService.getOrThrow<RabbitMQEnvironment>('rabbitmq'),
      }),
    }),
  ],
  controllers: [AuthController],
})
export class AppModule {}
