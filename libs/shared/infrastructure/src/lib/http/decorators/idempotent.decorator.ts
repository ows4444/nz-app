import { CustomDecorator, SetMetadata } from '@nestjs/common';

export const IDEMPOTENT_KEY = 'IDEMPOTENT_KEY';

export const Idempotent = (): CustomDecorator => SetMetadata(IDEMPOTENT_KEY, true);
