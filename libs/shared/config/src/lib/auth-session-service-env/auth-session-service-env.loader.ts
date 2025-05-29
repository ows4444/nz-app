import { registerAs } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { AuthSessionServiceEnvironmentSchema } from './auth-session-service-env.schema';
import { AUTH_SESSION_SERVICE_ENV, AuthSessionServiceEnvironment } from './auth-session-service-env.types';

export const authServiceEnvLoader = registerAs(AUTH_SESSION_SERVICE_ENV, (): AuthSessionServiceEnvironment => {
  const config = plainToInstance(AuthSessionServiceEnvironmentSchema, process.env, {
    enableImplicitConversion: true,
    excludeExtraneousValues: true,
  });

  const errors = validateSync(config, {
    skipMissingProperties: false,
    forbidUnknownValues: true,
    whitelist: true,
  });

  if (errors.length > 0) {
    const errorMessages = errors.flatMap((error) => Object.values(error.constraints ?? { [error.property]: 'Invalid value' })).join('\n- ');

    throw new Error(`Environment validation failed:\n- ${errorMessages}`);
  }

  return {
    host: config.AUTH_SESSION_SERVICE_HOST,
    port: config.AUTH_SESSION_SERVICE_PORT,
  };
});
