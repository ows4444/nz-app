import { Module } from '@nestjs/common';
import { UserAccountService } from '@nz/application-auth';
import { AuthController } from '@nz/presentation-auth';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [UserAccountService],
})
export class AppModule {}
