import { Metadata } from '@grpc/grpc-js';
import { Controller } from '@nestjs/common';
import { IdentityService } from '@nz/identity-device-application';
import { GrpcIdempotent } from '@nz/shared-infrastructure';
import { identityDevice } from '@nz/shared-proto';
import { Observable } from 'rxjs';

@Controller('identity')
@identityDevice.IdentityServiceControllerMethods()
export class IdentityController implements identityDevice.IdentityServiceController {
  constructor(private readonly identityService: IdentityService) {}
  @GrpcIdempotent()
  register(request: identityDevice.RegisterRequest, metadata?: Metadata): Promise<identityDevice.RegisterResponse> | Observable<identityDevice.RegisterResponse> | identityDevice.RegisterResponse {
    return this.identityService.register(request, metadata);
  }
}
