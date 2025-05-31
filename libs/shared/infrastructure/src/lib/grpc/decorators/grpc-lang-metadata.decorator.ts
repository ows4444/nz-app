import { Metadata } from '@grpc/grpc-js';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GrpcLangMetadata = createParamDecorator((data: Metadata | undefined, ctx: ExecutionContext): Metadata => {
  const request = ctx.switchToHttp().getRequest();
  const lang = request.headers['accept-language'];
  const metadata = data instanceof Metadata ? data : new Metadata();
  metadata.set('accept-language', lang);
  return metadata;
});
