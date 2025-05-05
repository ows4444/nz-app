import { Controller, Inject, OnModuleInit, Post } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { AUTH_PACKAGE_NAME, AUTH_SERVICE_NAME, AuthServiceClient } from '../proto/auth';

@Controller('auth')
export class AuthController implements OnModuleInit {
  private authService!: AuthServiceClient;
  constructor(@Inject(AUTH_PACKAGE_NAME) private readonly client: ClientGrpc) {}
  onModuleInit() {
    this.authService = this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }

  @Post('login')
  //@UseInterceptors(GrpcToHttpInterceptor)
  login(username: string, password: string) {
    return this.authService.login({ username, password });
  }
}
