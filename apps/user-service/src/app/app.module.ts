import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SharedConfigModule, TypeOrmEnvironment } from '@nz/config';
import { UserAccountEntityORM } from '@nz/infrastructure-auth';

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
  // controllers: [AuthController],
  // providers: ([] as Provider[]).concat(
  //   [
  //     AuthService,
  //     {
  //       provide: USER_ACCOUNT_REPOSITORY,
  //       useClass: TypeormUserAccountRepository,
  //     },
  //   ],
  //   UseCases,
  // ),
})
export class AppModule {}
