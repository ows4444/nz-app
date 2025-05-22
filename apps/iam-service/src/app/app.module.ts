import { Module, Provider } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { authConfigLoader, SharedConfigModule, TypeOrmEnvironment } from '@nz/config';
import { AuthService, IAMCommandHandlers } from '@nz/iam-application';
import {
  LoginAttemptEntityORM,
  TypeormUserContactRepository,
  TypeormUserCredentialRepository,
  TypeormUserProfileRepository,
  UserContactEntityORM,
  UserCredentialEntityORM,
  UserProfileEntityORM,
} from '@nz/iam-infrastructure';
import { GrpcServerExceptionFilter } from '@nz/shared-infrastructure';
import { AuthController } from './auth.controller';
import { HealthController } from './health.controller';

@Module({
  imports: [
    CqrsModule.forRoot(),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...configService.getOrThrow<TypeOrmEnvironment>('typeorm'),
        entities: [UserProfileEntityORM, UserContactEntityORM, UserCredentialEntityORM, LoginAttemptEntityORM],
      }),
      imports: [ConfigModule],
    }),
    SharedConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      load: [authConfigLoader],
    }),
  ],
  controllers: [AuthController, HealthController],
  providers: ([] as Provider[]).concat(
    [
      AuthService,
      {
        provide: APP_FILTER,
        useClass: GrpcServerExceptionFilter,
      },
      TypeormUserProfileRepository,
      TypeormUserContactRepository,
      TypeormUserCredentialRepository,
    ],
    IAMCommandHandlers,
  ),
})
export class AppModule {}
