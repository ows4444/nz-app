import { Controller } from '@nestjs/common';
import { AuthService } from '@nz/iam-application';
import { auth } from '@nz/shared-proto';
import { Observable } from 'rxjs';

@Controller('auth')
@auth.AuthServiceControllerMethods()
export class AuthController implements auth.AuthServiceController {
  constructor(private readonly authService: AuthService) {}
  loginByEmail(request: auth.LoginByEmailRequest): Promise<auth.LoginResponse> | Observable<auth.LoginResponse> | auth.LoginResponse {
    return this.authService.loginByEmail(request);
  }
  loginByUsername(request: auth.LoginByUsernameRequest): Promise<auth.LoginResponse> | Observable<auth.LoginResponse> | auth.LoginResponse {
    return this.authService.loginByUsername(request);
  }
  register(request: auth.RegisterRequest): Promise<auth.RegisterResponse> | Observable<auth.RegisterResponse> | auth.RegisterResponse {
    return this.authService.register(request);
  }
}
