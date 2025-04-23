import { EnvironmentType } from '@nz/const';

export interface Environment {
  environment: EnvironmentType;
  isProduction: boolean;
  port: number;
  enableSwagger: boolean;
  awsRegion: string;
  host: string;
  apiPrefix?: string;
  corsOrigins?: string[];
}
