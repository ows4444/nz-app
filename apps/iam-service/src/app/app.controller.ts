import { Controller } from '@nestjs/common';
import { AuthService } from '@nz/iam-application';
import { Observable } from 'rxjs';
import { IAMServiceController, IAMServiceControllerMethods, LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../proto/iam';

@Controller('auth')
@IAMServiceControllerMethods()
export class AppController implements IAMServiceController {
  constructor(private readonly authService: AuthService) {}

  login(loginRequest: LoginRequest): Promise<LoginResponse> | Observable<LoginResponse> | LoginResponse {
    return this.authService.login(loginRequest);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  register(_request: RegisterRequest): Promise<RegisterResponse> | Observable<RegisterResponse> | RegisterResponse {
    throw new Error('Method not implemented.');
  }
}
