import { Metadata } from '@grpc/grpc-js';
import { Body, Controller, Inject, OnModuleInit, Post } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { GrpcLangMetadata } from '@nz/shared-infrastructure';
import { userDevice } from '@nz/shared-proto';
import { RegisterDto } from '@nz/user-device-presentation';

@Controller('user')
export class UserController implements OnModuleInit {
  private userServiceClient!: userDevice.UserServiceClient;

  constructor(@Inject(userDevice.protobufPackage) private readonly grpcClient: ClientGrpc) {}

  onModuleInit() {
    this.userServiceClient = this.grpcClient.getService<userDevice.UserServiceClient>(userDevice.USER_SERVICE_NAME);
  }

  @Post('register')
  register(@Body() loginRequest: RegisterDto, @GrpcLangMetadata() acceptLangMeta: Metadata) {
    return this.userServiceClient.register(loginRequest, acceptLangMeta);
  }
}
