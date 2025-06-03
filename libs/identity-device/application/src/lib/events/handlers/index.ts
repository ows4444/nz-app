import { AssignDeviceToUserEventHandler } from './assign-device-to-user.handler';
import { CreateUserCredentialEventHandler } from './create-user-credential.handler';

export const IdentityDeviceEventHandlers = [CreateUserCredentialEventHandler, AssignDeviceToUserEventHandler];
