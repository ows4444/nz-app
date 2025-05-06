import { Catch, RpcExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';

@Catch(RpcException)
export class GrpcServerExceptionFilter implements RpcExceptionFilter<RpcException> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  catch(exception: RpcException): Observable<any> {
    return throwError(() => exception.getError());
  }
}
