import { Controller } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthServiceController, AuthServiceControllerMethods, LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../proto/auth';

@Controller()
@AuthServiceControllerMethods()
export class AppController implements AuthServiceController {
  login(request: LoginRequest): Promise<LoginResponse> | Observable<LoginResponse> | LoginResponse {
    throw new Error('Method not implemented.');
  }
  register(request: RegisterRequest): Promise<RegisterResponse> | Observable<RegisterResponse> | RegisterResponse {
    throw new Error('Method not implemented.');
  }
}
