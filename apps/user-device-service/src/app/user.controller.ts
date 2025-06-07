import { Metadata } from '@grpc/grpc-js';
import { Controller } from '@nestjs/common';
import { userDevice } from '@nz/shared-proto';
import { Observable } from 'rxjs';

@Controller('user')
@userDevice.UserServiceControllerMethods()
export class UserController implements userDevice.UserServiceController {
  getUserDeviceInfo(request: userDevice.UserDeviceRequest, metadata?: Metadata): Promise<userDevice.UserDeviceResponse> | Observable<userDevice.UserDeviceResponse> | userDevice.UserDeviceResponse {
    throw new Error('Method not implemented.');
  }
}
