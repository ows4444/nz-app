import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module, Provider } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthService, UseCases } from '@nz/application-auth';
import { RabbitMQEnvironment, SharedConfigModule, TypeOrmEnvironment } from '@nz/config';
import { USER_ACCOUNT_REPOSITORY } from '@nz/domain-auth';
import { TypeormUserAccountRepository, UserAccountEntityORM } from '@nz/infrastructure-auth';
import { AuthController } from '@nz/presentation-auth';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...configService.getOrThrow<TypeOrmEnvironment>('typeorm'),
        entities: [UserAccountEntityORM],
      }),
      imports: [ConfigModule],
    }),
    SharedConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
    }),
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
  providers: ([] as Provider[]).concat(
    [
      AuthService,
      {
        provide: USER_ACCOUNT_REPOSITORY,
        useClass: TypeormUserAccountRepository,
      },
    ],
    UseCases,
  ),
})
export class AppModule {}
