import { Transform } from 'class-transformer';
import { IsPositive } from 'class-validator';

export class AttachRolePermissionDto {
  @IsPositive()
  @Transform(({ value }) => parseInt(value, 10))
  roleId: number;

  @IsPositive()
  @Transform(({ value }) => parseInt(value, 10))
  permissionId: number;
}
