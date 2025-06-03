import { Metadata } from '@grpc/grpc-js';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { CallHandler, ExecutionContext, Inject, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { createHash } from 'crypto';
import { catchError, Observable, of, tap } from 'rxjs';
import { GRPC_IDEMPOTENT_KEY } from '../decorators';

@Injectable()
export class GrpcIdempotencyInterceptor implements NestInterceptor {
  private readonly logger = new Logger(GrpcIdempotencyInterceptor.name);
  private defaultTtl = 5;

  constructor(private readonly reflector: Reflector, @Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}
  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<unknown>> {
    const isIdempotent = this.reflector.get(GRPC_IDEMPOTENT_KEY, context.getHandler());

    if (!isIdempotent) {
      return next.handle();
    }

    const [requestBody, metadata] = context.getArgs();

    let idempotencyKey: string | undefined = undefined;

    if (metadata instanceof Metadata) {
      const metaVal = metadata.get('idempotency-key')?.[0];
      if (typeof metaVal === 'string') {
        idempotencyKey = metaVal;
      }
    }

    if (!idempotencyKey) {
      const bodyString = JSON.stringify(requestBody || {});
      const handlerName = context.getHandler().name;
      const keyBasis = `gRPC:${handlerName}:${bodyString}`;
      idempotencyKey = createHash('sha256').update(keyBasis).digest('hex');
    }
    const existing = await this.cacheManager.get(idempotencyKey);
    if (existing) {
      const cachedClone = JSON.parse(JSON.stringify(existing));
      this.logger.debug(`Serving response from cache for key=${idempotencyKey}`);
      return of(cachedClone);
    }

    return next.handle().pipe(
      tap(async (handlerResponse) => {
        try {
          const toCache = JSON.parse(JSON.stringify(handlerResponse));
          await this.cacheManager.set(idempotencyKey, toCache, this.defaultTtl * 1000);
          this.logger.debug(`Cached response under key=${idempotencyKey}`);
        } catch (err) {
          this.logger.error(`Failed to cache response: ${err instanceof Error ? err.message : err}`);
        }
      }),
      catchError((err) => {
        this.logger.error(`Idempotency processing error: ${err}`);
        throw err;
      }),
    );
  }
}
