import { Injectable, NestMiddleware } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class CookiesMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    cookieParser()(req, res, next);
  }
}
