import { status } from '@grpc/grpc-js';
import { Controller, Get, HttpException, HttpStatus, Inject, OnModuleInit } from '@nestjs/common';
import { type ClientGrpc } from '@nestjs/microservices';
import { authSession, health, identityDevice } from '@nz/shared-proto';
import { catchError, throwError } from 'rxjs';

@Controller('health')
export class HealthController implements OnModuleInit {
  private authSessionHealthServiceClient!: health.HealthServiceClient;
  private identityDeviceHealthServiceClient!: health.HealthServiceClient;

  constructor(@Inject(authSession.protobufPackage) private readonly grpcAuthSessionClient: ClientGrpc, @Inject(identityDevice.protobufPackage) private readonly grpcIdentityDeviceClient: ClientGrpc) {}

  onModuleInit() {
    this.authSessionHealthServiceClient = this.grpcAuthSessionClient.getService<health.HealthServiceClient>(health.HEALTH_SERVICE_NAME);
    this.identityDeviceHealthServiceClient = this.grpcIdentityDeviceClient.getService<health.HealthServiceClient>(health.HEALTH_SERVICE_NAME);
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

  @Get(identityDevice.protobufPackage)
  checkIdentityDevice() {
    return this.identityDeviceHealthServiceClient.check({}).pipe(
      catchError((error) => {
        if (error.code === status.UNAVAILABLE) {
          throw new HttpException('Identity Device service unreachable', HttpStatus.BAD_GATEWAY);
        }
        return throwError(() => error);
      }),
    );
  }
}
