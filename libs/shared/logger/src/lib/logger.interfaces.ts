/* eslint-disable @typescript-eslint/no-explicit-any */
import { LogLevel, ModuleMetadata, Type } from '@nestjs/common';
import { EnvironmentType } from '@nz/const';

export interface LoggerModuleOptions {
  appName: string;
  environment: EnvironmentType;
  logLevel: LogLevel;
  maskedFields?: string[];
  logFile?: string;
  maskDepth?: number;
}

export type MaskedData<T> = T extends Array<infer U> ? MaskedData<U>[] : T extends object ? { [K in keyof T]: MaskedData<T[K]> | (string extends T[K] ? string : T[K]) } : T;

export interface LoggerModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<LoggerModuleFactory>;
  useClass?: Type<LoggerModuleFactory>;
  useFactory?: (...args: any[]) => Promise<LoggerModuleOptions> | LoggerModuleOptions;
  inject?: any[];
}

export interface LoggerModuleFactory {
  createLoggerOptions(): Promise<LoggerModuleOptions> | LoggerModuleOptions;
}
