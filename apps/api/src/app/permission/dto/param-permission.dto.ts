import { PermissionStatus } from '@domain/entities';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsPositive } from 'class-validator';

export class PermissionParamDto {
  @IsPositive()
  @Transform(({ value }) => parseInt(value))
  permissionId: number;

  @IsOptional()
  @IsEnum(PermissionStatus)
  status: PermissionStatus;
}
