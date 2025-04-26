import { ArgumentsHost, Catch, HttpException, Logger } from '@nestjs/common';
import { GqlArgumentsHost, GqlExceptionFilter } from '@nestjs/graphql';

@Catch(HttpException)
export class GqlHttpExceptionFilter implements GqlExceptionFilter {
  private readonly logger = new Logger(GqlHttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost): { statusCode: number; timestamp: string; path: string; message: string | string[] } {
    const gqlHost = GqlArgumentsHost.create(host);
    // Extract the request from the GraphQL context.
    // Depending on your setup, it might be available on either `req` or `request`
    const ctx = gqlHost.getContext();
    const request = ctx.req || ctx.request;
    const url = request ? request.url : 'unknown';
    const status = exception.getStatus();

    const errorResponse: {
      statusCode: number;
      timestamp: string;
      path: string;
      message: string | string[];
    } = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: url,
      message: typeof exception.getResponse() === 'string' ? exception.getResponse() : Object(exception.getResponse()).message || exception.message,
    };

    this.logger.error(`${request ? request.method : 'GRAPHQL'} ${url} - ${exception.message}`, exception.stack);

    // In GraphQL, you typically throw the exception again or return a custom error object.
    // Here, we return the errorResponse which will be used by the GraphQL exception handling layer.
    return errorResponse;
  }
}
