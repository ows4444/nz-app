import { Metadata } from '@grpc/grpc-js';
import { Controller } from '@nestjs/common';
import { GrpcIdempotent } from '@nz/shared-infrastructure';
import { identity } from '@nz/shared-proto';
import { Observable } from 'rxjs';

@Controller('identity')
@identity.IdentityServiceControllerMethods()
export class IdentityController implements identity.IdentityServiceController {
  @GrpcIdempotent()
  register(request: identity.RegisterRequest, metadata?: Metadata): Promise<identity.RegisterResponse> | Observable<identity.RegisterResponse> | identity.RegisterResponse {
    throw new Error('Method not implemented.');
  }
}
