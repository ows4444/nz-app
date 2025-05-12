import { Body, Controller, Inject, OnModuleInit, Post } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { LoginByEmailDto, LoginByUsernameDto, RegisterDto } from '@nz/iam-presentation';
import { iam } from '@nz/shared-proto';

@Controller('auth')
export class AuthController implements OnModuleInit {
  private iamServiceClient!: iam.IAMServiceClient;

  constructor(@Inject(iam.IAM_PACKAGE_NAME) private readonly grpcClient: ClientGrpc) {}

  onModuleInit() {
    this.iamServiceClient = this.grpcClient.getService<iam.IAMServiceClient>(iam.IAM_SERVICE_NAME);
  }

  @Post('login/email')
  authenticate(@Body() loginRequest: LoginByEmailDto) {
    return this.iamServiceClient.loginByEmail(loginRequest);
  }

  @Post('login/username')
  authenticateByUsername(@Body() loginRequest: LoginByUsernameDto) {
    return this.iamServiceClient.loginByUsername(loginRequest);
  }

  @Post('register')
  register(@Body() registerRequest: RegisterDto) {
    return this.iamServiceClient.register(registerRequest);
  }
}
