import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const RequestUser = createParamDecorator((data: string, ctx: ExecutionContext): any => {
  const request: Request = ctx.switchToHttp().getRequest();

  return data ? request.session?.['user']?.[data] : request.session?.['user'];
});
