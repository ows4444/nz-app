import { Module, Provider } from '@nestjs/common';

import { AuthService } from '@nz/application-auth';
import { SharedConfigModule } from '@nz/config';
import { USER_ACCOUNT_REPOSITORY } from '@nz/domain-auth';
import { UserAccountEntityORM } from '@nz/infrastructure-auth';
import { AuthController } from '@nz/presentation-auth';

@Module({
  imports: [
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
