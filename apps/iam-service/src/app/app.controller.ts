import { Controller } from '@nestjs/common';
import { GrpcNotFoundException } from '@nz/shared-infrastructure';
import { Observable } from 'rxjs';
import { IAMServiceController, IAMServiceControllerMethods, LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../proto/iam';

@Controller('iam')
@IAMServiceControllerMethods()
export class AppController implements IAMServiceController {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  login(_request: LoginRequest): Promise<LoginResponse> | Observable<LoginResponse> | LoginResponse {
    throw new GrpcNotFoundException('Method not implemented.');
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  register(_request: RegisterRequest): Promise<RegisterResponse> | Observable<RegisterResponse> | RegisterResponse {
    throw new Error('Method not implemented.');
  }
}
