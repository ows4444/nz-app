export interface ICacheStrategy {
  get<T>(key: string): T | null | Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): void | Promise<void>;
  delete(key: string): boolean | Promise<boolean>;
  clear(): void | Promise<void>;
  has(key: string): boolean | Promise<boolean>;
}
