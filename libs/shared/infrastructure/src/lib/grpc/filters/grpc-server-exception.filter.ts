import { Catch, RpcExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';

@Catch(RpcException)
export class GrpcServerExceptionFilter implements RpcExceptionFilter<RpcException> {
  catch(exception: RpcException): Observable<unknown> {
    return throwError(() => exception.getError());
  }
}
