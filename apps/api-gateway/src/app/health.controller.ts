import { status } from '@grpc/grpc-js';
import { Controller, Get, HttpException, HttpStatus, Inject, OnModuleInit } from '@nestjs/common';
import { type ClientGrpc } from '@nestjs/microservices';
import { authSession, health, userDevice } from '@nz/shared-proto';
import { catchError, throwError } from 'rxjs';

@Controller('health')
export class HealthController implements OnModuleInit {
  private authSessionHealthServiceClient!: health.HealthServiceClient;
  private userDeviceHealthServiceClient!: health.HealthServiceClient;

  constructor(@Inject(authSession.protobufPackage) private readonly grpcAuthSessionClient: ClientGrpc, @Inject(userDevice.protobufPackage) private readonly grpcUserDeviceClient: ClientGrpc) {}

  onModuleInit() {
    this.authSessionHealthServiceClient = this.grpcAuthSessionClient.getService<health.HealthServiceClient>(health.HEALTH_SERVICE_NAME);
    this.userDeviceHealthServiceClient = this.grpcUserDeviceClient.getService<health.HealthServiceClient>(health.HEALTH_SERVICE_NAME);
  }

  @Get(authSession.protobufPackage)
  checkAuthSession() {
    return this.authSessionHealthServiceClient.check({}).pipe(
      catchError((error) => {
        if (error.code === status.UNAVAILABLE) {
          throw new HttpException('Health service unreachable', HttpStatus.BAD_GATEWAY);
        }
        return throwError(() => error);
      }),
    );
  }

  @Get(userDevice.protobufPackage)
  checkUserDevice() {
    return this.userDeviceHealthServiceClient.check({}).pipe(
      catchError((error) => {
        if (error.code === status.UNAVAILABLE) {
          throw new HttpException('User Device service unreachable', HttpStatus.BAD_GATEWAY);
        }
        return throwError(() => error);
      }),
    );
  }
}
