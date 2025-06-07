import { Metadata } from '@grpc/grpc-js';
import { Body, Controller, Inject, OnModuleInit, Post } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { LoginByEmailDto, LoginByUsernameDto, RegisterDto } from '@nz/auth-session-presentation';
import { GrpcLangMetadata } from '@nz/shared-infrastructure';
import { authSession } from '@nz/shared-proto';

@Controller('auth')
export class AuthController implements OnModuleInit {
  private authServiceClient!: authSession.AuthServiceClient;

  constructor(@Inject(authSession.protobufPackage) private readonly grpcClient: ClientGrpc) {}

  onModuleInit() {
    this.authServiceClient = this.grpcClient.getService<authSession.AuthServiceClient>(authSession.AUTH_SERVICE_NAME);
  }

  @Post('login/email')
  authenticate(@Body() loginRequest: LoginByEmailDto) {
    return this.authServiceClient.loginByEmail(loginRequest);
  }

  @Post('login/username')
  authenticateByUsername(@Body() loginRequest: LoginByUsernameDto) {
    return this.authServiceClient.loginByUsername(loginRequest);
  }

  @Post('register')
  register(@Body() loginRequest: RegisterDto, @GrpcLangMetadata() acceptLangMeta: Metadata) {
    return this.authServiceClient.registerUser(loginRequest, acceptLangMeta);
  }
}
