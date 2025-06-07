import { Controller } from '@nestjs/common';
import { userDevice } from '@nz/shared-proto';

@Controller('user')
@userDevice.UserServiceControllerMethods()
export class UserController implements userDevice.UserServiceController {}
