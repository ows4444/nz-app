import { Metadata } from '@grpc/grpc-js';
import { Controller } from '@nestjs/common';
import { GrpcIdempotent } from '@nz/shared-infrastructure';
import { userDevice } from '@nz/shared-proto';
import { UserService } from '@nz/user-device-application';
import { Observable } from 'rxjs';

@Controller('user')
@userDevice.UserServiceControllerMethods()
export class UserController implements userDevice.UserServiceController {
  constructor(private readonly userService: UserService) {}
  @GrpcIdempotent()
  register(request: userDevice.RegisterRequest, metadata?: Metadata): Promise<userDevice.RegisterResponse> | Observable<userDevice.RegisterResponse> | userDevice.RegisterResponse {
    return this.userService.register(request, metadata);
  }
}
