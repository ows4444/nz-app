import { PermissionStatus } from '@domain/entities';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsPositive } from 'class-validator';

export class PermissionParamDto {
  @IsPositive()
  @Transform(({ value }) => parseInt(value))
  @ApiProperty({ example: 1, type: Number })
  permissionId: number;

  @IsOptional()
  @IsEnum(PermissionStatus)
  @ApiProperty({ enum: PermissionStatus, example: PermissionStatus.ACTIVE })
  status: PermissionStatus;
}
