import { Expose, Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

import { EnvironmentType, LogLevel } from '@nz/const';
export class LoggerEnvironmentSchema {
  @Expose()
  @IsEnum(EnvironmentType)
  NODE_ENV!: EnvironmentType;

  @Expose()
  @IsString()
  APP_NAME!: string;

  @Expose()
  @IsEnum(LogLevel)
  LOG_LEVEL!: LogLevel;

  @Expose()
  @IsString()
  @IsOptional()
  LOG_FILE?: string;

  @Expose()
  @IsString({ each: true })
  @IsOptional()
  @Transform(({ value }: { value: string }) => value?.split(',').map((v: string) => v.trim()))
  MASKED_FIELDS?: string[];

  @Expose()
  @IsNumber()
  @IsOptional()
  MASK_DEPTH?: number;
}
