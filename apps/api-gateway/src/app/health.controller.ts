import { status } from '@grpc/grpc-js';
import { Controller, Get, HttpException, HttpStatus, Inject, OnModuleInit } from '@nestjs/common';
import { type ClientGrpc } from '@nestjs/microservices';
import { auth, health } from '@nz/shared-proto';
import { catchError, throwError } from 'rxjs';

@Controller('health')
export class HealthController implements OnModuleInit {
  private healthServiceClient!: health.HealthServiceClient;

  constructor(@Inject(auth.protobufPackage) private readonly grpcClient: ClientGrpc) {}

  onModuleInit() {
    this.healthServiceClient = this.grpcClient.getService<health.HealthServiceClient>(health.HEALTH_SERVICE_NAME);
  }

  @Get(auth.protobufPackage)
  check() {
    return this.healthServiceClient.check({}).pipe(
      catchError((error) => {
        if (error.code === status.UNAVAILABLE) {
          throw new HttpException('Health service unreachable', HttpStatus.BAD_GATEWAY);
        }
        return throwError(() => error);
      }),
    );
  }
}
