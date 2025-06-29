import { EnvironmentType } from '@nz/const';
import { parseBoolean } from '@nz/utils';
import { Expose, Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class EnvironmentSchema {
  @Expose()
  @IsEnum(EnvironmentType)
  NODE_ENV!: EnvironmentType;

  @Expose()
  @IsNumber()
  @Transform(({ value }: { value: string }) => parseInt(value, 10))
  PORT!: number;

  @Expose()
  @IsString()
  @Transform(({ value }: { value: string }) => value?.trim())
  APP_NAME!: string;

  @Expose()
  @IsString()
  @Transform(({ value }: { value: string }) => value?.trim())
  HOST!: string;

  @Expose()
  @IsString()
  @IsOptional()
  @Transform(({ value }: { value: string }) => value?.trim())
  API_PREFIX?: string;

  @Expose()
  @IsBoolean()
  @Transform(({ value }) => parseBoolean(value))
  ENABLE_SWAGGER: unknown;

  @Expose()
  @IsString()
  AWS_REGION!: string;

  @Expose()
  @IsString({ each: true })
  @IsOptional()
  @Transform(({ value }: { value: string }) => value?.split(',').map((v: string) => v.trim()))
  CORS_ORIGINS?: string[];
}
