import { Expose, Transform } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class AuthSessionServiceEnvironmentSchema {
  @Expose()
  @IsNumber()
  @Transform(({ value }: { value: string }) => parseInt(value, 10))
  AUTH_SESSION_SERVICE_PORT!: number;

  @Expose()
  @IsString()
  @Transform(({ value }: { value: string }) => value?.trim())
  AUTH_SESSION_SERVICE_HOST!: string;
}
