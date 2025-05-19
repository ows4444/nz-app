import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformResponseInterceptor implements NestInterceptor {
  private readonly logger = new Logger(TransformResponseInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() !== 'http') {
      return next.handle();
    }
    const request = context.switchToHttp().getRequest();
    const now = new Date().toISOString();

    return next.handle().pipe(
      map((data) => {
        const responseStructure = {
          statusCode: context.switchToHttp().getResponse().statusCode,
          timestamp: now,
          path: request.url,
          data,
        };

        // Log detailed response information for monitoring
        this.logger.log(`${request.method} ${request.url} - Response sent at ${now}`);

        return responseStructure;
      }),
    );
  }
}
