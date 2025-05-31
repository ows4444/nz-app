import { Metadata } from '@grpc/grpc-js';
import { Body, Controller, Inject, OnModuleInit, Post } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { RegisterDto } from '@nz/identity-device-presentation';
import { GrpcLangMetadata } from '@nz/shared-infrastructure';
import { identityDevice } from '@nz/shared-proto';

@Controller('identity')
export class IdentityController implements OnModuleInit {
  private identityServiceClient!: identityDevice.IdentityServiceClient;

  constructor(@Inject(identityDevice.protobufPackage) private readonly grpcClient: ClientGrpc) {}

  onModuleInit() {
    this.identityServiceClient = this.grpcClient.getService<identityDevice.IdentityServiceClient>(identityDevice.IDENTITY_SERVICE_NAME);
  }

  @Post('register')
  register(@Body() loginRequest: RegisterDto, @GrpcLangMetadata() acceptLangMeta: Metadata) {
    return this.identityServiceClient.register(loginRequest, acceptLangMeta);
  }
}
