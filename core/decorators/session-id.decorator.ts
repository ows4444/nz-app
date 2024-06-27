import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import session from 'express-session';

export type SessionData = session.Session & Partial<session.SessionData>;

export const Session = createParamDecorator((data: string | 'id' | 'destroy', ctx: ExecutionContext): any => {
  const request: Request = ctx.switchToHttp().getRequest();

  const session = request.session as SessionData;

  if (data === 'id') {
    return request.sessionID;
  } else if (data === 'destroy') {
    request.session.destroy((err) => {
      if (err) {
        console.error(err);
      }
    });
    return;
  } else if (data) {
    return session[data];
  } else {
    return Object.assign(request.session, { ID: request.sessionID });
  }
});
