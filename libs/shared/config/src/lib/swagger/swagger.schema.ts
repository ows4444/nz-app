import { Expose, Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString, ValidateIf } from 'class-validator';

import { parseBoolean } from '@nz/utils';

export class SwaggerEnvironmentSchema {
  @Expose()
  @IsBoolean()
  @Transform(({ value }) => parseBoolean(value))
  SWAGGER_ENABLE!: unknown;

  @Expose()
  @IsString()
  @ValidateIf((o) => o.SWAGGER_ENABLE)
  SWAGGER_TITLE!: string;

  @Expose()
  @IsString()
  @ValidateIf((o) => o.SWAGGER_ENABLE)
  SWAGGER_DESCRIPTION!: string;

  @Expose()
  @IsString()
  @IsOptional()
  @ValidateIf((o) => o.SWAGGER_ENABLE)
  SWAGGER_URL?: string;

  @Expose()
  @IsString()
  @IsOptional()
  @ValidateIf((o) => o.SWAGGER_ENABLE)
  SWAGGER_VERSION?: string;

  @Expose()
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => parseBoolean(value))
  @ValidateIf((o) => o.SWAGGER_ENABLE)
  SWAGGER_GENERATE_OPEN_API_SPEC?: unknown;
}
