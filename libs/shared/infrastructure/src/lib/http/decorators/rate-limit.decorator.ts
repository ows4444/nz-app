import { CustomDecorator, SetMetadata } from '@nestjs/common';

export const RATE_LIMIT_KEY = 'RATE_LIMIT_KEY';
export interface RateLimitOptions {
  limit: number;
  ttl: number;
}
export const RateLimit = (options: RateLimitOptions): CustomDecorator => SetMetadata(RATE_LIMIT_KEY, options);
