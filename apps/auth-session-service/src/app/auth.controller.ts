import { Metadata } from '@grpc/grpc-js';
import { Controller } from '@nestjs/common';
import { GrpcIdempotent } from '@nz/shared-infrastructure';
import { auth } from '@nz/shared-proto';
import { Observable } from 'rxjs';

@Controller('auth')
@auth.AuthServiceControllerMethods()
export class AuthController implements auth.AuthServiceController {
  @GrpcIdempotent()
  loginByEmail(request: auth.LoginByEmailRequest, metadata?: Metadata): Promise<auth.LoginResponse> | Observable<auth.LoginResponse> | auth.LoginResponse {
    throw new Error('Method not implemented.');
  }
  @GrpcIdempotent()
  loginByUsername(request: auth.LoginByUsernameRequest, metadata?: Metadata): Promise<auth.LoginResponse> | Observable<auth.LoginResponse> | auth.LoginResponse {
    throw new Error('Method not implemented.');
  }
}
