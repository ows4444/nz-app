import { ApiProperty } from '@nestjs/swagger';
import { Expose, Exclude } from 'class-transformer';
import { IsString } from 'class-validator';

@Exclude()
export class CreateRoleDto {
  @IsString()
  @Expose()
  @ApiProperty({ example: 'admin' })
  name: string;

  @IsString()
  @Expose()
  @ApiProperty({ example: 'Admin' })
  description: string;
}
