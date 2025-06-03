import { registerAs } from '@nestjs/config';
import { parseBoolean } from '@nz/utils';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { RabbitMQSchema } from './rabbitmq.schema';
import { RABBITMQ_ENV, RabbitMQEnvironment } from './rabbitmq.types';

export const rabbitMQLoader = registerAs(RABBITMQ_ENV, (): RabbitMQEnvironment => {
  const config = plainToInstance(RabbitMQSchema, process.env, {
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

  if (parseBoolean(config.RABBITMQ_DISABLE)) {
    return {} as RabbitMQEnvironment;
  }

  return {
    uri: config.RABBITMQ_URI,
  };
});
