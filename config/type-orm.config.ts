/* eslint-disable @typescript-eslint/no-unsafe-return */
import { validateConfig } from '@core/helpers/validate-config';
import { parseBoolean } from '@core/utils/parse-boolean';
import { registerAs } from '@nestjs/config';
import { Transform } from 'class-transformer';
import { IsString, IsInt, IsOptional, IsEnum, IsBoolean } from 'class-validator';

export class TypeORMEnvConfig {
  @IsString()
  @IsEnum(['mysql', 'mariadb'])
  type: string;

  @IsString()
  database: string;

  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsString()
  host: string;

  @IsInt()
  @Transform(({ value }: { value: string }) => parseInt(value, 10))
  port: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => (value ? parseBoolean(value) : value))
  logging?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => (value ? parseBoolean(value) : value))
  synchronize?: string;
}

export default registerAs('typeorm', () =>
  validateConfig<TypeORMEnvConfig>(
    {
      type: process.env.TYPEORM_TYPE,
      database: process.env.TYPEORM_DATABASE,
      username: process.env.TYPEORM_USERNAME,
      password: process.env.TYPEORM_PASSWORD,
      host: process.env.TYPEORM_HOST,
      port: process.env.TYPEORM_PORT,
      logging: process.env.TYPEORM_LOGGING,
      synchronize: process.env.TYPEORM_SYNCHRONIZE,
    },
    TypeORMEnvConfig,
  ),
);
