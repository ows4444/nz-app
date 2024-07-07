import { TypeormStore, SessionEntity } from '@core/helpers/typeorm-store';
import { Session } from '@domain/entities';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import session from 'express-session';
import { Repository } from 'typeorm';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class SessionMiddleware implements NestMiddleware {
  store: TypeormStore;
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<SessionEntity>,
  ) {
    this.store = new TypeormStore({
      repository: this.sessionRepository,
      serializer: (data) => JSON.stringify(data),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      deserializer: (data) => JSON.parse(data),
      clearExpired: true,
      expirationInterval: 1,
      ttl: 1400000, // 60 seconds
      captureRejections: true,
    });
  }

  use(req: Request, res: Response, next: NextFunction): void {
    session({
      store: this.store,
      secret: 'your_secretsS',
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 1500000 },
    })(req, res, next);
  }
}
