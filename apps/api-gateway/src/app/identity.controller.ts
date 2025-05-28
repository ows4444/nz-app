import { Body, Controller, Inject, OnModuleInit, Post } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { RegisterDto } from '@nz/identity-device-presentation';
import { identityDevice } from '@nz/shared-proto';

@Controller('identity')
export class AuthController implements OnModuleInit {
  private identityServiceClient!: identityDevice.IdentityServiceClient;

  constructor(@Inject(identityDevice.protobufPackage) private readonly grpcClient: ClientGrpc) {}

  onModuleInit() {
    this.identityServiceClient = this.grpcClient.getService<identityDevice.IdentityServiceClient>(identityDevice.IDENTITY_SERVICE_NAME);
  }

  @Post('register')
  register(@Body() loginRequest: RegisterDto) {
    return this.identityServiceClient.register(loginRequest);
  }
}
