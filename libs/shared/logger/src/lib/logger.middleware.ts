import { Injectable, NestMiddleware } from '@nestjs/common';

import { Request, Response } from 'express';

import { LoggerService } from './logger.service';

@Injectable()
export class HttpLoggingMiddleware implements NestMiddleware {
  constructor(private readonly logger: LoggerService) {}

  use(req: Request, res: Response, next: () => void): void {
    const start = Date.now();
    const { method, originalUrl, ip, headers, body } = req;

    res.on('finish', () => {
      const duration = Date.now() - start;
      this.logger.log('HTTP Request', 'HttpLogging', {
        method,
        url: originalUrl,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
        clientIp: headers['x-forwarded-for'] || ip,
        userAgent: headers['user-agent'],
        body: this.redactSensitiveBody(body),
      });
    });

    next();
  }

  private redactSensitiveBody(body: unknown): unknown {
    return body && typeof body === 'object'
      ? this.logger['maskSensitiveData'](body) // Access private method for internal use
      : body;
  }
}
