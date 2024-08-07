import { IsPositive } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class DeletePermissionDto {
  @IsPositive()
  @Transform(({ value }) => parseInt(value, 10))
  @ApiProperty({ example: 1, type: Number })
  permissionId: number;
}
