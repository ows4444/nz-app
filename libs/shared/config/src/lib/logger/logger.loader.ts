import { registerAs } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { LoggerEnvironmentSchema } from './logger.schema';
import { LoggerEnvironment } from './logger.types';

export const loggerLoader = registerAs('logger', (): LoggerEnvironment => {
  const config = plainToInstance(LoggerEnvironmentSchema, process.env, {
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
    environment: config.NODE_ENV,
    appName: config.APP_NAME,
    logLevel: config.LOG_LEVEL,
    maskedFields: config.MASKED_FIELDS,
    logFile: config.LOG_FILE,
    maskDepth: config.MASK_DEPTH,
  };
});
