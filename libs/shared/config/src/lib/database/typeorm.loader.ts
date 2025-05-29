import { registerAs } from '@nestjs/config';
import { parseBoolean } from '@nz/utils';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { TypeOrmSchema } from './typeorm.schema';
import { TYPEORM_ENV, TypeOrmEnvironment } from './typeorm.types';

export const typeOrmLoader = registerAs(TYPEORM_ENV, (): TypeOrmEnvironment => {
  const config = plainToInstance(TypeOrmSchema, process.env, {
    enableImplicitConversion: true,
    excludeExtraneousValues: true,
  });

  const errors = validateSync(config, {
    skipMissingProperties: false,
    forbidUnknownValues: true,
  });

  if (errors.length > 0) {
    const errorMessages = errors
      .flatMap((error) =>
        Object.values(
          error.constraints ?? {
            [error.property]: 'Invalid value',
          },
        ),
      )
      .join('; ');

    throw new Error(`Database configuration error: ${errorMessages}`);
  }

  if (parseBoolean(config.TYPEORM_DISABLE)) {
    return {} as TypeOrmEnvironment;
  }

  return {
    type: config.TYPEORM_TYPE,
    database: config.TYPEORM_DATABASE,
    username: config.TYPEORM_USERNAME,
    password: config.TYPEORM_PASSWORD,
    host: config.TYPEORM_HOST,
    port: config.TYPEORM_PORT,
    logging: parseBoolean(config.TYPEORM_LOGGING),
    synchronize: parseBoolean(config.TYPEORM_SYNCHRONIZE),
    runMigrations: parseBoolean(config.TYPEORM_RUN_MIGRATIONS),
  };
});
