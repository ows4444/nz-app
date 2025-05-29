import { Metadata } from '@grpc/grpc-js';
import { Controller } from '@nestjs/common';
import { AuthService } from '@nz/auth-session-application';
import { GrpcIdempotent } from '@nz/shared-infrastructure';
import { authSession } from '@nz/shared-proto';
import { Observable } from 'rxjs';

@Controller('auth')
@authSession.AuthServiceControllerMethods()
export class AuthController implements authSession.AuthServiceController {
  constructor(private readonly authService: AuthService) {}
  @GrpcIdempotent()
  registerCredential(
    request: authSession.RegisterCredentialRequest,
    metadata?: Metadata,
  ): Promise<authSession.RegisterCredentialResponse> | Observable<authSession.RegisterCredentialResponse> | authSession.RegisterCredentialResponse {
    return this.authService.registerCredential(request);
  }
  @GrpcIdempotent()
  loginByEmail(request: authSession.LoginByEmailRequest, metadata?: Metadata): Promise<authSession.LoginResponse> | Observable<authSession.LoginResponse> | authSession.LoginResponse {
    throw new Error('Method not implemented.');
  }
  @GrpcIdempotent()
  loginByUsername(request: authSession.LoginByUsernameRequest, metadata?: Metadata): Promise<authSession.LoginResponse> | Observable<authSession.LoginResponse> | authSession.LoginResponse {
    throw new Error('Method not implemented.');
  }
}
