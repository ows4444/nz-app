import { registerAs } from '@nestjs/config';
import { parseBoolean } from '@nz/utils';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { SwaggerEnvironmentSchema } from './swagger.schema';
import { SwaggerEnvironment } from './swagger.types';

export const swaggerEnvLoader = registerAs('swagger', (): SwaggerEnvironment => {
  const config = plainToInstance(SwaggerEnvironmentSchema, process.env, {
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

  if (!parseBoolean(config.SWAGGER_ENABLE)) {
    return {} as SwaggerEnvironment;
  }

  return {
    title: config.SWAGGER_TITLE,
    description: config.SWAGGER_DESCRIPTION,
    url: config.SWAGGER_URL,
    version: config.SWAGGER_VERSION,
    generateOpenApiSpec: parseBoolean(config.SWAGGER_GENERATE_OPEN_API_SPEC),
  };
});
