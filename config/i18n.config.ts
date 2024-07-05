/* eslint-disable @typescript-eslint/no-unsafe-return */
import { validateConfig } from '@core/helpers/validate-config';
import { parseBoolean } from '@core/utils/parse-boolean';
import { registerAs } from '@nestjs/config';
import { Transform } from 'class-transformer';
import { IsString, IsEnum, IsBoolean } from 'class-validator';

export class I18nEnvConfig {
  @IsString()
  @IsEnum(['en'])
  fallbackLanguage: string;

  @IsString()
  path: string;

  @IsBoolean()
  @Transform(({ value }) => (value ? parseBoolean(value) : value))
  watch: string;
}

export default registerAs('i18n', () =>
  validateConfig<I18nEnvConfig>(
    {
      fallbackLanguage: process.env.I18N_FALLBACK_LANGUAGE,
      path: process.env.I18N_PATH,
      watch: process.env.I18N_WATCH,
    },
    I18nEnvConfig,
  ),
);
