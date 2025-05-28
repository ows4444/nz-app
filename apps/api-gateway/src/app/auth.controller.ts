import { Body, Controller, Inject, OnModuleInit, Post } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { LoginByEmailDto, LoginByUsernameDto } from '@nz/auth-session-presentation';
import { authSession } from '@nz/shared-proto';

@Controller('auth')
export class AuthController implements OnModuleInit {
  private iamServiceClient!: authSession.AuthServiceClient;

  constructor(@Inject(authSession.protobufPackage) private readonly grpcClient: ClientGrpc) {}

  onModuleInit() {
    this.iamServiceClient = this.grpcClient.getService<authSession.AuthServiceClient>(authSession.AUTH_SERVICE_NAME);
  }

  @Post('login/email')
  authenticate(@Body() loginRequest: LoginByEmailDto) {
    return this.iamServiceClient.loginByEmail(loginRequest);
  }

  @Post('login/username')
  authenticateByUsername(@Body() loginRequest: LoginByUsernameDto) {
    return this.iamServiceClient.loginByUsername(loginRequest);
  }
}
