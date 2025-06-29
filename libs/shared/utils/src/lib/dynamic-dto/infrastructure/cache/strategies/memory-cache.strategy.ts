import { Injectable } from '@nestjs/common';
import { ICacheStrategy } from '../../../core/interfaces/cache/cache-strategy.interface';

@Injectable()
export class MemoryCacheStrategy implements ICacheStrategy {
  private readonly cache = new Map<string, { value: unknown; expires?: number }>();

  async get<T>(key: string): Promise<T | null> {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    if (entry.expires && Date.now() > entry.expires) {
      this.cache.delete(key);
      return null;
    }

    return entry.value as Promise<T>;
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const entry = {
      value,
      expires: ttl ? Date.now() + ttl * 1000 : undefined,
    };

    await this.cache.set(key, entry);
  }

  async delete(key: string): Promise<boolean> {
    return this.cache.delete(key);
  }

  async clear(): Promise<void> {
    this.cache.clear();
  }

  async has(key: string): Promise<boolean> {
    const exists = this.cache.has(key);

    if (exists) {
      const entry = this.cache.get(key);
      if (entry?.expires && Date.now() > entry.expires) {
        this.cache.delete(key);
        return false;
      }
    }

    return exists;
  }
}
