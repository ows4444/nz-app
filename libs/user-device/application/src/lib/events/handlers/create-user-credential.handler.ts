import { Metadata } from '@grpc/grpc-js';
import { Inject, OnModuleInit } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import type { ClientGrpc } from '@nestjs/microservices';
import { authSession } from '@nz/shared-proto';
import { CreateUserCredentialEvent } from '@nz/user-device-domain';
import { lastValueFrom } from 'rxjs';

@EventsHandler(CreateUserCredentialEvent)
export class CreateUserCredentialEventHandler implements IEventHandler<CreateUserCredentialEvent>, OnModuleInit {
  private authSessionServiceClient!: authSession.AuthServiceClient;

  constructor(@Inject(authSession.protobufPackage) private readonly grpcClient: ClientGrpc) {}

  onModuleInit() {
    this.authSessionServiceClient = this.grpcClient.getService<authSession.AuthServiceClient>(authSession.AUTH_SERVICE_NAME);
  }

  async handle({ userId, password, lang }: CreateUserCredentialEvent) {
    const metadata = new Metadata();

    metadata.add('Accept-Language', lang);

    await lastValueFrom(
      this.authSessionServiceClient.registerCredential(
        {
          userId,
          password,
        },
        metadata,
      ),
    );
  }
}
