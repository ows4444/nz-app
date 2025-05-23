import { Body, Controller, Inject, OnModuleInit, Post } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { LoginByEmailDto, LoginByUsernameDto, RegisterDto } from '@nz/iam-presentation';
import { Idempotent } from '@nz/shared-infrastructure';
import { auth } from '@nz/shared-proto';

@Controller('auth')
export class AuthController implements OnModuleInit {
  private iamServiceClient!: auth.AuthServiceClient;

  constructor(@Inject(auth.protobufPackage) private readonly grpcClient: ClientGrpc) {}

  onModuleInit() {
    this.iamServiceClient = this.grpcClient.getService<auth.AuthServiceClient>(auth.AUTH_SERVICE_NAME);
  }

  @Post('login/email')
  @Idempotent()
  authenticate(@Body() loginRequest: LoginByEmailDto) {
    return this.iamServiceClient.loginByEmail(loginRequest);
  }

  @Post('login/username')
  @Idempotent()
  authenticateByUsername(@Body() loginRequest: LoginByUsernameDto) {
    return this.iamServiceClient.loginByUsername(loginRequest);
  }

  @Post('register')
  @Idempotent()
  register(@Body() registerRequest: RegisterDto) {
    return this.iamServiceClient.register(registerRequest);
  }
}
