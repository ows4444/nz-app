import type { status as GrpcStatusCode } from '@grpc/grpc-js';
import { RpcException } from '@nestjs/microservices';

export type GrpcExceptionPayload = {
  message: string;
  code: GrpcStatusCode | number;
};

export function errorObject(error: string | object, code: GrpcStatusCode): GrpcExceptionPayload {
  return {
    message: JSON.stringify({
      error,
      type: typeof error === 'string' ? 'string' : 'object',
      exceptionName: RpcException.name,
    }),
    code,
  };
}
