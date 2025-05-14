import { Module, Provider } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { authConfigLoader, SharedConfigModule, TypeOrmEnvironment } from '@nz/config';
import { AuthService, IAMCommandHandlers } from '@nz/iam-application';
import { USER_CREDENTIAL_REPOSITORY, USER_REPOSITORY } from '@nz/iam-domain';
import { TypeormUserCredentialRepository, TypeormUserRepository, UserCredentialEntityORM, UserEntityORM } from '@nz/iam-infrastructure';
import { GrpcServerExceptionFilter } from '@nz/shared-infrastructure';
import { AppController } from './app.controller';

@Module({
  imports: [
    CqrsModule.forRoot(),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...configService.getOrThrow<TypeOrmEnvironment>('typeorm'),
        entities: [UserEntityORM, UserCredentialEntityORM],
      }),
      imports: [ConfigModule],
    }),
    SharedConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      load: [authConfigLoader],
    }),
  ],
  controllers: [AppController],
  providers: ([] as Provider[]).concat(
    [
      AuthService,
      {
        provide: APP_FILTER,
        useClass: GrpcServerExceptionFilter,
      },
      {
        provide: USER_REPOSITORY,
        useClass: TypeormUserRepository,
      },
      {
        provide: USER_CREDENTIAL_REPOSITORY,
        useClass: TypeormUserCredentialRepository,
      },
    ],
    IAMCommandHandlers,
  ),
})
export class AppModule {}
