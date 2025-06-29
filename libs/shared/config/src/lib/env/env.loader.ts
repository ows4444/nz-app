import { registerAs } from '@nestjs/config';
import { EnvironmentType } from '@nz/const';
import { parseBoolean } from '@nz/utils';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import path from 'path';
import { EnvironmentSchema } from './env.schema';
import { Environment, ENVIRONMENT_ENV } from './env.types';

export function getEnvFile(envFilePath: string | string[] | undefined): string[] {
  const nodeEnv = process.env.NODE_ENV ?? EnvironmentType.Development;

  const envFiles = new Map<EnvironmentType, string>([
    [EnvironmentType.Development, '.env.development'],
    [EnvironmentType.Production, '.env.production'],
  ]);

  const envFileNames = [envFiles.get(nodeEnv as EnvironmentType), '.env'].filter((envFile): envFile is string => envFile !== undefined);

  const envFilePathStr = Array.isArray(envFilePath) ? envFilePath[0] : envFilePath;

  return sortEnvFiles(
    envFilePathStr ? [...envFileNames.map((name) => path.join('apps', envFilePathStr.split(path.sep)[envFilePathStr.split(path.sep).indexOf('apps') + 1], name)), ...envFileNames] : envFileNames,
  );
}

export function sortEnvFiles(files: string[]): string[] {
  return files.sort((a, b) => {
    const aSegments = a.split(path.sep).length;
    const bSegments = b.split(path.sep).length;
    if (aSegments !== bSegments) {
      return bSegments - aSegments;
    }
    return b.length - a.length;
  });
}

export const envLoader = registerAs(ENVIRONMENT_ENV, (): Environment => {
  const config = plainToInstance(EnvironmentSchema, process.env, {
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
    url: `${config.HOST}:${config.PORT}`,
    host: config.HOST,
    appName: config.APP_NAME,
    apiPrefix: config.API_PREFIX,
    environment: config.NODE_ENV,
    isProduction: config.NODE_ENV === EnvironmentType.Production,
    port: config.PORT,
    enableSwagger: parseBoolean(config.ENABLE_SWAGGER),
    awsRegion: config.AWS_REGION,
    corsOrigins: config.CORS_ORIGINS,
  };
});
