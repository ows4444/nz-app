import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger, NotFoundException } from '@nestjs/common';

import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost): void {
    if (host.getType() !== 'http') {
      // Optionally, handle or rethrow exceptions for non-HTTP contexts
      return;
    }

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Guard against undefined request
    const url = request ? request.url : 'unknown';
    const method = request ? request.method : 'unknown';
    const status = exception.getStatus();

    // Base error response structure
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const errorResponse: any = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: url,
    };

    // Add detailed error message based on exception type
    if (exception instanceof NotFoundException) {
      errorResponse.message = exception.message;
    } else {
      const res = Object(exception.getResponse());
      errorResponse.message = typeof res === 'string' ? res : res.message || exception.message;
      errorResponse.data = res.data;
    }

    // Log detailed error information for debugging
    this.logger.error(`${method} ${url} - ${exception.message}`, exception.stack);

    response.status(status).json(errorResponse);
  }
}
