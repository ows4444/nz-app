import { Expose, Transform } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class UserDeviceServiceEnvironmentSchema {
  @Expose()
  @IsNumber()
  @Transform(({ value }: { value: string }) => parseInt(value, 10))
  USER_DEVICE_SERVICE_PORT!: number;

  @Expose()
  @IsString()
  @Transform(({ value }: { value: string }) => value?.trim())
  USER_DEVICE_SERVICE_HOST!: string;
}
