import { registerAs } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { AuthEnvironmentSchema } from './auth-env.schema';
import { AuthEnvironment, PepperVersions } from './auth-env.types';

export const authConfigLoader = registerAs('auth-env', (): AuthEnvironment => {
  const config = plainToInstance(AuthEnvironmentSchema, process.env, {
    enableImplicitConversion: true,
    excludeExtraneousValues: true,
  });

  const errors = validateSync(config, {
    skipMissingProperties: false,
    forbidUnknownValues: true,
  });

  if (errors.length > 0) {
    const errorMessages = errors.flatMap((error) => Object.values(error.constraints ?? { [error.property]: 'Invalid value' })).join('; ');

    throw new Error(`Auth configuration error: ${errorMessages}`);
  }

  const pepperVersions: PepperVersions = {};
  if (config.PEPPERS) {
    const pepperEntries = config.PEPPERS.split('|');
    pepperEntries.forEach((entry) => {
      const [version, value] = entry.split(':');
      if (version && value) {
        pepperVersions[version] = value;
      }
    });
  }

  if (!config.PEPPERS_DEFAULT || !pepperVersions[config.PEPPERS_DEFAULT]) {
    throw new Error(`Auth configuration error: Default pepper version "${config.PEPPERS_DEFAULT}" not found in PEPPERS`);
  }

  return {
    peppers: pepperVersions,
    defaultPepperVersion: config.PEPPERS_DEFAULT,
  };
});
