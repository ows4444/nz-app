import { registerAs } from '@nestjs/config';
import { EnvironmentType } from '@nz/const';
import { parseBoolean } from '@nz/utils';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import path from 'path';
import { EnvironmentSchema } from './env.schema';
import { Environment } from './env.types';

export function getEnvFile(envFilePath: string | string[] | undefined): string[] {
  const nodeEnv = process.env.NODE_ENV ?? EnvironmentType.Development;

  const envFiles = new Map<EnvironmentType, string>([
    [EnvironmentType.Development, '.env'],
    [EnvironmentType.Test, '.env.test'],
    [EnvironmentType.Staging, '.env.staging'],
    [EnvironmentType.Production, '.env.prod'],
  ]);

  const envFileName = envFiles.get(nodeEnv as EnvironmentType) ?? '.env';

  if (!envFilePath) return [envFileName];
  return Array.from(Array.isArray(envFilePath) ? envFilePath.map((p) => path.join('apps', p, envFileName)) : envFilePath ? [path.join('apps', envFilePath, envFileName)] : [envFileName]).concat(
    envFileName,
  );
}

export const envLoader = registerAs('env', (): Environment => {
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
    apiPrefix: config.API_PREFIX,
    environment: config.NODE_ENV,
    isProduction: config.NODE_ENV === EnvironmentType.Production,
    port: config.PORT,
    enableSwagger: parseBoolean(config.ENABLE_SWAGGER),
    awsRegion: config.AWS_REGION,
    corsOrigins: config.CORS_ORIGINS,
  };
});
