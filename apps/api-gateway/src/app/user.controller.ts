import { Controller, Inject, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { userDevice } from '@nz/shared-proto';

@Controller('user')
export class UserController implements OnModuleInit {
  private userServiceClient!: userDevice.UserServiceClient;

  constructor(@Inject(userDevice.protobufPackage) private readonly grpcClient: ClientGrpc) {}

  onModuleInit() {
    this.userServiceClient = this.grpcClient.getService<userDevice.UserServiceClient>(userDevice.USER_SERVICE_NAME);
    console.log(this.userServiceClient == null ? 'User' : 'User Service Client Initialized');
  }
}
