import { Controller } from '@nestjs/common';
import { AuthService } from '@nz/iam-application';
import { iam } from '@nz/shared-proto';
import { Observable } from 'rxjs';

@Controller('auth')
@iam.IAMServiceControllerMethods()
export class AppController implements iam.IAMServiceController {
  constructor(private readonly authService: AuthService) {}
  loginByEmail(request: iam.LoginByEmailRequest): Promise<iam.LoginResponse> | Observable<iam.LoginResponse> | iam.LoginResponse {
    return this.authService.loginByEmail(request);
  }
  loginByUsername(request: iam.LoginByUsernameRequest): Promise<iam.LoginResponse> | Observable<iam.LoginResponse> | iam.LoginResponse {
    return this.authService.loginByUsername(request);
  }
  register(request: iam.RegisterRequest): Promise<iam.RegisterResponse> | Observable<iam.RegisterResponse> | iam.RegisterResponse {
    return this.authService.register(request);
  }
}
