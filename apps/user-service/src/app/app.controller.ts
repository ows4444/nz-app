import { Controller } from '@nestjs/common';
import { Observable } from 'rxjs';
import {
  CreateUserRequest,
  CreateUserResponse,
  DeleteUserRequest,
  DeleteUserResponse,
  GetUserRequest,
  GetUserResponse,
  UpdateUserRequest,
  UpdateUserResponse,
  UserServiceController,
  UserServiceControllerMethods,
} from '../proto/user';

@Controller()
@UserServiceControllerMethods()
export class AppController implements UserServiceController {
  getUser(request: GetUserRequest): Promise<GetUserResponse> | Observable<GetUserResponse> | GetUserResponse {
    throw new Error('Method not implemented.');
  }
  createUser(request: CreateUserRequest): Promise<CreateUserResponse> | Observable<CreateUserResponse> | CreateUserResponse {
    throw new Error('Method not implemented.');
  }
  updateUser(request: UpdateUserRequest): Promise<UpdateUserResponse> | Observable<UpdateUserResponse> | UpdateUserResponse {
    throw new Error('Method not implemented.');
  }
  deleteUser(request: DeleteUserRequest): Promise<DeleteUserResponse> | Observable<DeleteUserResponse> | DeleteUserResponse {
    throw new Error('Method not implemented.');
  }
}
