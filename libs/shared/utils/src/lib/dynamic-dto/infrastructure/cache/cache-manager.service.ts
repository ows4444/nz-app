import { Inject, Injectable } from '@nestjs/common';
import { ICacheManager } from '../../core/interfaces/cache/cache-manager.interface';
import type { ICacheStrategy } from '../../core/interfaces/cache/cache-strategy.interface';

@Injectable()
export class CacheManagerService implements ICacheManager {
  constructor(@Inject('ICacheStrategy') private readonly cacheStrategy: ICacheStrategy) {}

  async get<T>(key: string): Promise<T | null> {
    return this.cacheStrategy.get<T>(key);
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    return this.cacheStrategy.set(key, value, ttl);
  }

  async delete(key: string): Promise<boolean> {
    return this.cacheStrategy.delete(key);
  }

  async clear(): Promise<void> {
    return this.cacheStrategy.clear();
  }

  async has(key: string): Promise<boolean> {
    return this.cacheStrategy.has(key);
  }
}
