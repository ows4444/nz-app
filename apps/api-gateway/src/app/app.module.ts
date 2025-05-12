import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RabbitMQEnvironment, SharedConfigModule } from '@nz/config';
import { iam } from '@nz/shared-proto';
import { join } from 'path';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: iam.IAM_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          package: iam.IAM_PACKAGE_NAME,
          protoPath: join(__dirname, 'assets', 'iam.proto'),
          url: 'localhost:4000',
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
