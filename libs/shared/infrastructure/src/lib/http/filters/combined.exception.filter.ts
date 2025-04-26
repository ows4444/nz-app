import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';

import { GqlHttpExceptionFilter } from './gql-http-exception.filter';
import { HttpExceptionFilter } from './http-exception.filter';

@Catch(HttpException)
export class CombinedExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(CombinedExceptionFilter.name);

  constructor(private readonly httpFilter: HttpExceptionFilter, private readonly gqlFilter: GqlHttpExceptionFilter) {}

  catch(exception: HttpException, host: ArgumentsHost): HttpException | void | unknown {
    const type = host.getType(); // type is "http", "rpc", or "ws"
    this.logger.debug(`Handling exception in context: ${type}`);

    // For HTTP, inspect further to decide if it's GraphQL:
    if (type === 'http') {
      const ctx = host.switchToHttp();
      const request = ctx.getRequest();
      // Check if the body has a GraphQL query (adjust as needed for your app)
      if (request?.body && request.body.query) {
        return this.gqlFilter.catch(exception, host);
      } else {
        return this.httpFilter.catch(exception, host);
      }
    }

    // For non-HTTP contexts, you can simply return the exception
    return exception;
  }
}
