import { Expose, Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsNumber, IsString, ValidateIf } from 'class-validator';

import { parseBoolean } from '@nz/utils';
import { DatabaseType } from './typeorm.types';

export class TypeOrmSchema {
  @Expose()
  @IsBoolean()
  @ValidateIf((o) => !parseBoolean(o.TYPEORM_DISABLE))
  @Transform(({ value }) => parseBoolean(value))
  TYPEORM_DISABLE: unknown;

  @Expose()
  @ValidateIf((o) => !parseBoolean(o.TYPEORM_DISABLE))
  @IsEnum(DatabaseType)
  TYPEORM_TYPE!: DatabaseType;

  @Expose()
  @IsString()
  @ValidateIf((o) => !parseBoolean(o.TYPEORM_DISABLE))
  TYPEORM_DATABASE!: string;

  @Expose()
  @IsString()
  @ValidateIf((o) => !parseBoolean(o.TYPEORM_DISABLE))
  TYPEORM_USERNAME!: string;

  @Expose()
  @IsString()
  @ValidateIf((o) => !parseBoolean(o.TYPEORM_DISABLE))
  TYPEORM_PASSWORD!: string;

  @Expose()
  @IsString()
  @ValidateIf((o) => !parseBoolean(o.TYPEORM_DISABLE))
  TYPEORM_HOST!: string;

  @Expose()
  @IsNumber()
  @ValidateIf((o) => !parseBoolean(o.TYPEORM_DISABLE))
  @Transform(({ value }: { value: string }) => parseInt(value, 10))
  TYPEORM_PORT!: number;

  @Expose()
  @IsBoolean()
  @ValidateIf((o) => !parseBoolean(o.TYPEORM_DISABLE))
  @Transform(({ value }) => parseBoolean(value))
  TYPEORM_LOGGING: unknown;

  @Expose()
  @IsBoolean()
  @ValidateIf((o) => !parseBoolean(o.TYPEORM_DISABLE))
  @Transform(({ value }) => parseBoolean(value))
  TYPEORM_SYNCHRONIZE: unknown;

  @Expose()
  @IsBoolean()
  @ValidateIf((o) => !parseBoolean(o.TYPEORM_DISABLE))
  @Transform(({ value }) => parseBoolean(value))
  TYPEORM_RUN_MIGRATIONS: unknown;
}
