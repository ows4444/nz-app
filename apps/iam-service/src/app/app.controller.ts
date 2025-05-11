import { Controller } from '@nestjs/common';
import { GrpcNotFoundException } from '@nz/shared-infrastructure';
import { Observable } from 'rxjs';
import { AuthServiceController, AuthServiceControllerMethods, LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../proto/auth';

@Controller('auth')
@AuthServiceControllerMethods()
export class AppController implements AuthServiceController {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  login(_request: LoginRequest): Promise<LoginResponse> | Observable<LoginResponse> | LoginResponse {
    throw new GrpcNotFoundException('Method not implemented.');
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  register(_request: RegisterRequest): Promise<RegisterResponse> | Observable<RegisterResponse> | RegisterResponse {
    throw new Error('Method not implemented.');
  }
}
