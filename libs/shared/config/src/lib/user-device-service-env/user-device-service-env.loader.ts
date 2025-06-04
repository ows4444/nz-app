import { registerAs } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { UserDeviceServiceEnvironmentSchema } from './user-device-service-env.schema';
import { USER_DEVICE_SERVICE_ENV, UserDeviceServiceEnvironment } from './user-device-service-env.types';

export const userDeviceServiceEnvLoader = registerAs(USER_DEVICE_SERVICE_ENV, (): UserDeviceServiceEnvironment => {
  const config = plainToInstance(UserDeviceServiceEnvironmentSchema, process.env, {
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
    host: config.USER_DEVICE_SERVICE_HOST,
    port: config.USER_DEVICE_SERVICE_PORT,
  };
});
