import { Controller, Inject, OnModuleInit, Post } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { IAM_PACKAGE_NAME, IAM_SERVICE_NAME, IAMServiceClient } from '../proto/iam';

@Controller('iam')
export class IAMController implements OnModuleInit {
  private authService!: IAMServiceClient;
  constructor(@Inject(IAM_PACKAGE_NAME) private readonly client: ClientGrpc) {}
  onModuleInit() {
    this.authService = this.client.getService<IAMServiceClient>(IAM_SERVICE_NAME);
  }

  @Post('login')
  login(username: string, password: string) {
    return this.authService.login({ username, password });
  }
}
