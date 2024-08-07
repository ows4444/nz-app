import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsPositive } from 'class-validator';

export class AttachRolePermissionDto {
  @IsPositive()
  @Transform(({ value }) => parseInt(value, 10))
  @ApiProperty({ example: 1, type: Number })
  roleId: number;

  @IsPositive()
  @Transform(({ value }) => parseInt(value, 10))
  @ApiProperty({ example: 1, type: Number })
  permissionId: number;
}
