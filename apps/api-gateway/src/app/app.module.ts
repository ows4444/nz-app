import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { RabbitMQEnvironment, SharedConfigModule } from '@nz/config';
import { AuthController } from '@nz/presentation-auth';

@Module({
  imports: [
    SharedConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
    }),
    CqrsModule,
    RabbitMQModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        ...configService.getOrThrow<RabbitMQEnvironment>('rabbitmq'),
        enableControllerDiscovery: true,
      }),
    }),
  ],
  controllers: [AuthController],
})
export class AppModule {}
