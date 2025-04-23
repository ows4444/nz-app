import { LogLevel } from '@nestjs/common';
import { EnvironmentType } from '@nz/const';

export interface LoggerEnvironment {
  appName: string;
  environment: EnvironmentType;
  logLevel: LogLevel;
  maskedFields?: string[];
  logFile?: string;
  maskDepth?: number;
}
