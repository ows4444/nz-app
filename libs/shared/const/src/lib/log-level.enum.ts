import { LogLevel as logLevel } from '@nestjs/common';

export const LogLevel: { [K in logLevel as Uppercase<K>]: K } = {
  LOG: 'log',
  ERROR: 'error',
  WARN: 'warn',
  DEBUG: 'debug',
  VERBOSE: 'verbose',
  FATAL: 'fatal',
} as const;

export type LogLevel = (typeof LogLevel)[keyof typeof LogLevel];
