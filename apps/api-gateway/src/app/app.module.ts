import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RabbitMQEnvironment, SharedConfigModule } from '@nz/config';
import { join } from 'path';
import { IAM_PACKAGE_NAME } from '../proto/iam';
import { IAMController } from './auth.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: IAM_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          package: IAM_PACKAGE_NAME,
          protoPath: join(__dirname, 'assets', 'iam.proto'),
          url: 'localhost:8000',
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
  controllers: [IAMController],
})
export class AppModule {}
