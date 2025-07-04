// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.2
//   protoc               v5.29.3
// source: auth-session.proto

/* eslint-disable */
import { Metadata } from '@grpc/grpc-js';
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';

export const protobufPackage = 'authSession';

export interface LoginByEmailRequest {
  email: string;
  password: string;
}

export interface LoginByUsernameRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  message: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  deviceId: string;
  deviceInfo: string;
}

export interface RegisterResponse {
  message: string;
}

export const AUTH_SESSION_PACKAGE_NAME = 'authSession';

export interface AuthServiceClient {
  loginByEmail(request: LoginByEmailRequest, metadata?: Metadata): Observable<LoginResponse>;

  loginByUsername(request: LoginByUsernameRequest, metadata?: Metadata): Observable<LoginResponse>;

  registerUser(request: RegisterRequest, metadata?: Metadata): Observable<RegisterResponse>;
}

export interface AuthServiceController {
  loginByEmail(request: LoginByEmailRequest, metadata?: Metadata): Promise<LoginResponse> | Observable<LoginResponse> | LoginResponse;

  loginByUsername(request: LoginByUsernameRequest, metadata?: Metadata): Promise<LoginResponse> | Observable<LoginResponse> | LoginResponse;

  registerUser(request: RegisterRequest, metadata?: Metadata): Promise<RegisterResponse> | Observable<RegisterResponse> | RegisterResponse;
}

export function AuthServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ['loginByEmail', 'loginByUsername', 'registerUser'];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod('AuthService', method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod('AuthService', method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const AUTH_SERVICE_NAME = 'AuthService';
