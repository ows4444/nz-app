import { LessThan, Repository } from 'typeorm';
import { Store } from 'express-session';

export interface SessionEntity {
  id: string;
  expiresAt: number;
  data: string;
}

interface EventEmitterOptions {
  captureRejections?: boolean | undefined;
}

export interface Options extends EventEmitterOptions {
  repository: Repository<SessionEntity>;
  ttl?: number;
  clearExpired?: boolean;
  expirationInterval?: number;

  serializer?: (data: any) => string;
  deserializer?: (data: string) => any;
}

export class TypeormStore extends Store {
  private readonly repository: Repository<SessionEntity>;
  private readonly ttl?: number;
  private readonly expirationInterval: number;

  private readonly serializer: (data: any) => string;
  private readonly deserializer: <T = Record<string, any>>(data: string) => T;
  private expirationIntervalId?: NodeJS.Timeout;

  constructor(options: Options) {
    super(options);

    if (!options.repository) {
      throw new Error('The repository option is required');
    }

    this.repository = options.repository;
    this.ttl = options.ttl;
    this.expirationInterval = options.expirationInterval || 86400;

    this.serializer = options.serializer || JSON.stringify;
    this.deserializer = options.deserializer || JSON.parse;

    if (options.clearExpired === undefined || options.clearExpired) {
      this.setExpirationInterval(this.expirationInterval);
    }

    process.on('exit', () => this.clearExpirationInterval());
  }

  private logError(error: any): void {
    console.error(error);
  }

  public async all(callback: (error: any, result?: any) => void): Promise<void> {
    try {
      const sessions = await this.repository.find();
      const data = await Promise.all(sessions.map(async (session) => this.deserializer(session.data)));
      callback(null, data);
    } catch (error) {
      this.logError(error);
      callback(error);
    }
  }

  public async destroy(id: string, callback?: (error: any) => void): Promise<void> {
    try {
      await this.repository.delete(id);
      if (callback) callback(null);
    } catch (error) {
      this.logError(error);
      if (callback) callback(error);
    }
  }

  public async clear(callback?: (error: any) => void): Promise<void> {
    try {
      await this.repository.clear();
      if (callback) callback(null);
    } catch (error) {
      this.logError(error);
      if (callback) callback(error);
    }
  }

  public async length(callback: (error: any, length: number) => void): Promise<void> {
    try {
      const length = await this.repository.count();
      callback(null, length);
    } catch (error) {
      this.logError(error);
      callback(error, 0);
    }
  }

  public async get(id: string, callback: (error: any, session?: any) => void): Promise<void> {
    try {
      const session = await this.repository.findOne({ where: { id } });
      if (!session) {
        callback(null);
        return;
      }
      const data = this.deserializer(session.data);
      callback(null, data);
    } catch (error) {
      this.logError(error);
      callback(error);
    }
  }

  public async set(id: string, session: unknown, callback?: (error: any) => void): Promise<void> {
    try {
      const data = this.serializer(session);
      const ttl = this.getTTL(session);
      const expiresAt = Math.floor(Date.now() / 1000) + ttl;
      await this.repository.save({ id, data, expiresAt });
      if (callback) callback(null);
    } catch (error) {
      this.logError(error);
      if (callback) callback(error);
    }
  }

  public async touch(id: string, session: unknown, callback?: (error: any) => void): Promise<void> {
    const ttl = this.getTTL(session);
    const expiresAt = Math.floor(Date.now() / 1000) + ttl;

    try {
      await this.repository.update(id, { expiresAt });
      if (callback) callback(null);
    } catch (error) {
      this.logError(error);
      if (callback) callback(error);
    }
  }

  public async clearExpiredSessions(callback?: (error: any) => void): Promise<void> {
    const timestamp = Math.floor(Date.now() / 1000);

    try {
      await this.repository.delete({ expiresAt: LessThan(timestamp) });
      if (callback) callback(null);
    } catch (error) {
      this.logError(error);
      if (callback) callback(error);
    }
  }

  public setExpirationInterval(interval?: number): void {
    interval = interval || this.expirationInterval;

    this.clearExpirationInterval();
    this.expirationIntervalId = setInterval(() => this.clearExpiredSessions(), interval * 1000);
  }

  public clearExpirationInterval(): void {
    if (this.expirationIntervalId) {
      clearInterval(this.expirationIntervalId);
    }
    this.expirationIntervalId = undefined;
  }

  private getTTL(session: any): number {
    if (this.ttl) {
      return this.ttl;
    }
    return session.cookie && session.cookie.maxAge ? Math.floor(session.cookie.maxAge / 1000) : 86400;
  }
}
