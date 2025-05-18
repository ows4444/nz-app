import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CallHandler, ExecutionContext, HttpException, HttpStatus, Inject, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Cache } from 'cache-manager';
import { createHash } from 'crypto';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RATE_LIMIT_KEY, RateLimitOptions } from '../decorators/rate-limit.decorator';

@Injectable()
export class RateLimitInterceptor implements NestInterceptor {
  private readonly logger = new Logger(RateLimitInterceptor.name);

  private readonly fallbackOptions: RateLimitOptions = {
    limit: 10,
    ttl: 60000,
  };

  constructor(private readonly reflector: Reflector, @Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<unknown>> {
    const options = this.reflector.get<RateLimitOptions>(RATE_LIMIT_KEY, context.getHandler()) ?? this.fallbackOptions;

    const { limit, ttl } = options;

    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    if (!request || !request.ip || !request.method) {
      return next.handle();
    }

    const clientIp = this.extractClientIp(request);
    const path = request.originalUrl || request.url;
    const keyBasis = `${request.method}:${path}:${clientIp}`;
    const hashedKey = createHash('sha256').update(keyBasis).digest('hex');
    const cacheKey = `rl:${hashedKey}`;

    const rawCount = (await this.cacheManager.get<number>(cacheKey)) ?? 0;
    const newCount = rawCount + 1;
    const remainingTtl = rawCount ? await this.getRemainingTtl(cacheKey) : ttl;

    if (rawCount >= limit) {
      this.logger.warn(`Rate limit exceeded for key=${cacheKey} (count=${rawCount}, limit=${limit})`);

      response.setHeader('Retry-After', `${Math.ceil(remainingTtl / 1000)}`);
      throw new HttpException(`Rate limit of ${limit} req per ${Math.ceil(ttl / 1000)} seconds exceeded.`, HttpStatus.TOO_MANY_REQUESTS);
    }

    await this.cacheManager.set(cacheKey, newCount, remainingTtl);

    response.setHeader('X-RateLimit-Limit', `${limit}`);
    response.setHeader('X-RateLimit-Remaining', `${Math.max(limit - newCount, 0)}`);
    response.setHeader('X-RateLimit-Reset', `${Date.now() + remainingTtl}`);

    return next.handle().pipe(
      catchError(async (err) => {
        this.logger.error(`Error during rate-limited request: ${err.message}`);
        throw err;
      }),
    );
  }

  private extractClientIp(request: Request): string {
    const forwarded = request.headers?.['x-forwarded-for'];
    if (forwarded) {
      const ips = (forwarded as string).split(',').map((ip) => ip.trim());
      return ips[0];
    }
    return String(request.ip);
  }

  private async getRemainingTtl(cacheKey: string): Promise<number> {
    try {
      const ttlEpochMs = await this.cacheManager.ttl(cacheKey);
      if (ttlEpochMs) {
        const diff = Math.max(ttlEpochMs - Date.now(), 0);
        return diff;
      }

      return this.fallbackOptions.ttl;
    } catch {
      return this.fallbackOptions.ttl;
    }
  }
}
