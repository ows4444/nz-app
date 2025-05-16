import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Request } from 'express';

import 'reflect-metadata';

import { SortWithPaginationDto } from '@nz/utils';
import { Observable } from 'rxjs';

@Injectable()
export class QueryTransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request: Request = context.switchToHttp().getRequest();
    const query = request.query;
    const sortWithPaginationInstance = plainToInstance(SortWithPaginationDto, query);
    const dtoKeys = Object.keys(sortWithPaginationInstance);
    const params = Object.keys(query)
      .filter((key) => !dtoKeys.includes(key))
      .reduce((acc: Record<string, unknown>, key) => {
        acc[key] = query[key];
        return acc;
      }, {} as Record<string, unknown>);

    if (request.query['params']) {
      params['params'] = request.query['params'];
    }

    request.query.params = JSON.stringify(params);
    return next.handle();
  }
}
