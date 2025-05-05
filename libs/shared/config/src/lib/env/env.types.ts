import { EnvironmentType } from '@nz/const';

export interface Environment {
  environment: EnvironmentType;
  isProduction: boolean;
  port: number;

  awsRegion: string;
  host: string;
  url: string;
  enableSwagger: boolean;
  apiPrefix?: string;
  corsOrigins?: string[];
}
