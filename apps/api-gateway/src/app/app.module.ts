import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SharedConfigModule } from '@nz/config';
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
          url: 'localhost:4040',
        },
      },
    ]),

    SharedConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
    }),
  ],
  controllers: [AuthController],
})
export class AppModule {}
