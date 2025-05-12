import { Body, Controller, Inject, OnModuleInit, Post } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { IAM_PACKAGE_NAME, IAM_SERVICE_NAME, IAMServiceClient } from '../proto/iam';
import { LoginRequestDto } from './dtos';

@Controller('auth')
export class AuthController implements OnModuleInit {
  private iamServiceClient!: IAMServiceClient;

  constructor(@Inject(IAM_PACKAGE_NAME) private readonly grpcClient: ClientGrpc) {}

  onModuleInit() {
    this.iamServiceClient = this.grpcClient.getService<IAMServiceClient>(IAM_SERVICE_NAME);
  }

  @Post('login')
  authenticate(@Body() loginRequest: LoginRequestDto) {
    return this.iamServiceClient.login(loginRequest);
  }
}
