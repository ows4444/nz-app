import { LoggerModuleOptions } from './logger.interfaces';
import { LoggerService } from './logger.service';

export const createLoggerService = (options: LoggerModuleOptions): LoggerService => new LoggerService(options);
