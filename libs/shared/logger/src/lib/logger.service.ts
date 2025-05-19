import { codeFrameColumns } from '@babel/code-frame';
import { Inject, Injectable, LogLevel, LoggerService as NestLogger } from '@nestjs/common';
import { EnvironmentType } from '@nz/const';
import ErrorStackParser from 'error-stack-parser';
import fs from 'fs';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { LOGGER_OPTIONS } from './logger.constants';
import type { LoggerModuleOptions } from './logger.interfaces';
import { MaskedData } from './logger.interfaces';

@Injectable()
export class LoggerService implements NestLogger {
  private readonly logger: winston.Logger;
  private readonly maskedFields: Set<string>;
  private readonly maskDepth: number;

  constructor(@Inject(LOGGER_OPTIONS) private readonly options: LoggerModuleOptions) {
    this.maskedFields = new Set(options.maskedFields?.map((f) => f.toLowerCase()) || []);
    this.maskDepth = options.maskDepth ?? 2;
    this.logger = this.createLogger();
  }

  private createLogger(): winston.Logger {
    return winston.createLogger({
      level: this.options.logLevel,
      levels: winston.config.npm.levels,
      transports: [this.createTransport()],
    });
  }

  private createTransport(): winston.transport {
    return this.options.environment === EnvironmentType.Development ? new winston.transports.Console(this.consoleConfig()) : new DailyRotateFile(this.fileConfig());
  }

  private modifyAnsiString(str: string, modifyFn: (text: unknown) => string): string {
    // eslint-disable-next-line no-control-regex
    const ansiRegexGlobal = /(\x1b\[[0-9;]*m)/g;
    // eslint-disable-next-line no-control-regex
    const ansiRegexExact = /^\u001b\[[0-9;]*m$/;
    const segments = str.split(ansiRegexGlobal);
    const modifiedSegments = segments.map((segment) => {
      return ansiRegexExact.test(segment) ? segment : modifyFn(segment);
    });
    return modifiedSegments.join('');
  }

  private centerString(str: unknown, totalLength = 16): string {
    if (String(str).trim() === '') {
      return String(str).trim();
    }
    const padTotal = totalLength - String(str).length;
    if (padTotal <= 0) return String(str);
    const leftPadLength = Math.ceil(padTotal / 2);
    const leftPadded = String(str).padStart(String(str).length + leftPadLength);
    return leftPadded.padEnd(totalLength);
  }

  private consoleConfig(): winston.LoggerOptions {
    return {
      format: winston.format.combine(
        winston.format.timestamp({ format: 'hh.mm.ss.SSS' }),
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, context, params, ...rest }) => {
          let logOutput = [timestamp, this.modifyAnsiString(level, (text) => this.centerString(text, 6)), this.centerString(context, 20), message, JSON.stringify(params)]
            .filter((x) => x)
            .join('|')
            .trim();

          const error = rest['error'] as Error;

          if (error) {
            try {
              const stackFrames = ErrorStackParser.parse(error as Error);
              const regex = /(.*\/apps\/[^/]+)\/dist\/webpack:\/@nz\/[^/]+\/src\/(.*)/;
              const match = stackFrames[0].fileName?.match(regex);
              const simplePath = match ? `${match[1]}/src/${match[2]}` : stackFrames[0].fileName;

              const relevantFrames = stackFrames.filter(
                (frame) => frame.fileName && !frame.fileName.includes('node_modules') && frame.fileName.endsWith('.ts') && simplePath && fs.existsSync(simplePath),
              );

              if (!relevantFrames.length) {
                return logOutput;
              }

              for (const relevantFrame of relevantFrames) {
                const { lineNumber, columnNumber } = relevantFrame;

                if (!relevantFrame.fileName || !lineNumber) {
                  return logOutput;
                } else {
                  const match = relevantFrame.fileName?.match(regex);
                  const fileName = match ? `${match[1]}/src/${match[2]}` : relevantFrame.fileName;
                  const rawCode = fs.readFileSync(fileName, 'utf-8');
                  const codeFrame = codeFrameColumns(
                    rawCode,
                    { start: { line: lineNumber, column: columnNumber ?? 0 } },
                    { highlightCode: true, linesAbove: 5, linesBelow: 5, message: `Open File : ${fileName}:${lineNumber}:${columnNumber}` },
                  );
                  logOutput += `\n${codeFrame}\n`;
                }
              }
            } catch (frameError) {
              logOutput += `\n${error.stack}\n${Object(frameError).stack}`;
            }
          }

          return logOutput;
        }),
      ),
    };
  }

  private fileConfig() {
    return {
      filename: this.options.logFile || './logs/combined-%DATE%.log',
      datePattern: 'YY|MM|DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json(),
        winston.format((info) => ({
          ...info,
          appName: this.options.appName,
          meta: this.maskSensitiveData(info.meta),
        }))(),
      ),
    };
  }

  private maskSensitiveData<T>(obj: T, depth = 0): MaskedData<T> {
    if (!obj || typeof obj !== 'object' || depth >= this.maskDepth) {
      return obj as MaskedData<T>;
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.maskSensitiveData(item, depth + 1) as MaskedData<T>) as MaskedData<T>;
    } else {
      const entries = Object.entries(obj as Record<string, unknown>).reduce((acc, [key, value]) => {
        acc[key] = this.maskedFields.has(key.toLowerCase()) ? '********' : this.maskSensitiveData(value, depth + 1);
        return acc;
      }, {} as Record<string, unknown>);
      return entries as MaskedData<T>;
    }
  }

  private logMessage(level: LogLevel, message: string, context: unknown, error?: Error | string, ...params: unknown[]): void {
    const winstonLevel = level === 'log' ? 'info' : level;
    const safeParams = params.map((p: unknown): string => {
      try {
        return typeof p === 'object' ? JSON.parse(JSON.stringify(p)) : String(p);
      } catch {
        return '[Unserializable Data]';
      }
    });

    this.logger.log(winstonLevel, message, {
      error,
      context,
      params: safeParams.length ? this.maskSensitiveData(safeParams) : undefined,
    });
  }

  log(message: string, context: string, ...params: unknown[]): void {
    this.logMessage('log', message, context, undefined, ...params);
  }

  error(message: string, error: Error, context: string, ...params: unknown[]): void {
    this.logMessage('error', message, context, error, ...params);
  }

  warn(message: string, context: string, ...params: unknown[]): void {
    this.logMessage('warn', message, context, undefined, ...params);
  }

  debug(message: string, context: string, ...params: unknown[]): void {
    this.logMessage('debug', message, context, undefined, ...params);
  }

  verbose(message: string, context: string, ...params: unknown[]): void {
    this.logMessage('verbose', message, context, undefined, ...params);
  }
}
