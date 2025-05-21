import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { BadRequestException, CallHandler, ExecutionContext, Inject, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { type Cache } from 'cache-manager';
import { createHash } from 'crypto';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { IDEMPOTENT_KEY } from '../decorators';

@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
  private readonly logger = new Logger(IdempotencyInterceptor.name);
  private defaultTtl = 300;

  constructor(private readonly reflector: Reflector, @Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<unknown>> {
    const isIdempotent = this.reflector.get(IDEMPOTENT_KEY, context.getHandler());
    if (!isIdempotent) {
      return next.handle();
    }

    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    if (request.method !== 'POST') {
      throw new BadRequestException('Idempotency can only be applied to POST requests');
    }

    const headerKey = request.headers['idempotency-key'] as string | undefined;
    let idempotencyKey: string;

    if (!headerKey) {
      const bodyString = JSON.stringify(request.body || {});
      const path = request.path;
      const keyBasis = `${request.method}:${path}:${bodyString}`;
      idempotencyKey = createHash('sha256').update(keyBasis).digest('hex');
      response.setHeader('Idempotency-Key', idempotencyKey);
      response.setHeader('Idempotency-Key-TTL', this.defaultTtl.toString());
    } else {
      idempotencyKey = headerKey.trim();
      response.setHeader('Idempotency-Key', idempotencyKey);
      response.setHeader('Idempotency-Key-TTL', this.defaultTtl.toString());
    }
    const existing = await this.cacheManager.get(idempotencyKey);

    if (existing) {
      const cachedClone = JSON.parse(JSON.stringify(existing));
      return of(cachedClone);
    }

    return next.handle().pipe(
      tap(async (handlerResponse) => {
        try {
          let toCache: unknown;
          try {
            toCache = JSON.parse(JSON.stringify(handlerResponse));
          } catch (serializationError) {
            this.logger.error(`Serialization failed for response under key=${idempotencyKey}: ${(serializationError as Error).message}. Skipping cache.`);
            return;
          }
          await this.cacheManager.set(idempotencyKey, toCache, this.defaultTtl * 1000);
        } catch (err: unknown) {
          if (err instanceof Error) {
            this.logger.error(`Failed to save idempotency response: ${err.message}`);
          } else {
            this.logger.error('Failed to save idempotency response: Unknown error');
          }
        }
      }),
      catchError((err) => {
        this.logger.error(`Idempotency error occurred: ${err}`);
        throw err;
      }),
    );
  }
}
