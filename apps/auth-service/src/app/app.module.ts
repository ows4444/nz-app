import { Module, Provider } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthService } from '@nz/application-auth';
import { SharedConfigModule, TypeOrmEnvironment } from '@nz/config';
import { USER_ACCOUNT_REPOSITORY } from '@nz/domain-auth';
import { UserAccountEntityORM } from '@nz/infrastructure-auth';
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
  ],
  controllers: [AuthController],
  providers: ([] as Provider[]).concat([
    AuthService,
    {
      provide: USER_ACCOUNT_REPOSITORY,
      useClass: UserAccountEntityORM,
    },
  ]),
})
export class AppModule {}
