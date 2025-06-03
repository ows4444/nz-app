import { CustomDecorator, SetMetadata } from '@nestjs/common';

export const GRPC_IDEMPOTENT_KEY = 'GRPC_IDEMPOTENT_KEY';

export const GrpcIdempotent = (): CustomDecorator => SetMetadata(GRPC_IDEMPOTENT_KEY, true);
