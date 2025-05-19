import { parseBoolean } from '@nz/utils';
import { Expose, Transform } from 'class-transformer';
import { IsBoolean, IsString, ValidateIf } from 'class-validator';

export class RabbitMQSchema {
  @Expose()
  @IsBoolean()
  @ValidateIf((o) => !parseBoolean(o.RABBITMQ_DISABLE))
  @Transform(({ value }) => parseBoolean(value))
  RABBITMQ_DISABLE: unknown;

  @Expose()
  @ValidateIf((o) => !parseBoolean(o.RABBITMQ_DISABLE))
  @IsString()
  RABBITMQ_URI!: string;
}
