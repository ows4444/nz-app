import { plainToClass, ClassConstructor } from 'class-transformer';
import { validateSync, ValidationError } from 'class-validator';

function validateConfig<T extends object>(config: T, envVariablesClass: ClassConstructor<T>): T {
  const validatedConfig = plainToClass(envVariablesClass, config, { enableImplicitConversion: true });
  const errors: ValidationError[] = validateSync(validatedConfig, { skipMissingProperties: false });
  if (errors.length > 0) {
    const errorMessages = errors.map((error) => Object.values(error.constraints || {}).join(', ')).join('; ');
    throw new Error(`Configuration validation failed: ${errorMessages}`);
  }
  return validatedConfig;
}

export { validateConfig };
