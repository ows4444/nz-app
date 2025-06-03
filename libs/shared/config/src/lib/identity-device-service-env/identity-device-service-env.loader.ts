import { registerAs } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { IdentityDeviceServiceEnvironmentSchema } from './identity-device-service-env.schema';
import { IDENTITY_DEVICE_SERVICE_ENV, IdentityDeviceServiceEnvironment } from './identity-device-service-env.types';

export const identityDeviceServiceEnvLoader = registerAs(IDENTITY_DEVICE_SERVICE_ENV, (): IdentityDeviceServiceEnvironment => {
  const config = plainToInstance(IdentityDeviceServiceEnvironmentSchema, process.env, {
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
    host: config.IDENTITY_DEVICE_SERVICE_HOST,
    port: config.IDENTITY_DEVICE_SERVICE_PORT,
  };
});
