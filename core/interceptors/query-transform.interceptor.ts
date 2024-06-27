import 'reflect-metadata';
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { plainToClass } from 'class-transformer';
import { SortWithPaginationDto } from '@core/dto/sort-with-pagination.dto';

@Injectable()
export class QueryTransformInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const query = request.query;
    const sortWithPaginationInstance = plainToClass(SortWithPaginationDto, query);
    const dtoKeys = Object.keys(sortWithPaginationInstance);
    const params = Object.keys(query)
      .filter((key) => !dtoKeys.includes(key))
      .reduce((acc, key) => {
        acc[key] = query[key];
        return acc;
      }, {});

    if (request.query['params']) {
      params['params'] = request.query['params'];
    }

    request.query['params'] = params;
    return next.handle();
  }
}
