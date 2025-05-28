import { Metadata } from '@grpc/grpc-js';
import { Controller } from '@nestjs/common';
import { GrpcIdempotent } from '@nz/shared-infrastructure';
import { identityDevice } from '@nz/shared-proto';
import { Observable } from 'rxjs';

@Controller('identity')
@identityDevice.IdentityServiceControllerMethods()
export class IdentityController implements identityDevice.IdentityServiceController {
  @GrpcIdempotent()
  register(request: identityDevice.RegisterRequest, metadata?: Metadata): Promise<identityDevice.RegisterResponse> | Observable<identityDevice.RegisterResponse> | identityDevice.RegisterResponse {
    throw new Error('Method not implemented.');
  }
}
