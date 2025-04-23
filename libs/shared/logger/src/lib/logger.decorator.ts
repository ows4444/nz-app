import { Inject } from '@nestjs/common';
import { LOGGER_SERVICE } from './logger.constants';

export const InjectLogger = (): ParameterDecorator => Inject(LOGGER_SERVICE);
