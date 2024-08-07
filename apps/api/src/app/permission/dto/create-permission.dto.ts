import { ApiProperty } from '@nestjs/swagger';
import { Expose, Exclude } from 'class-transformer';
import { IsString } from 'class-validator';

@Exclude()
export class CreatePermissionDto {
  @IsString()
  @Expose()
  @ApiProperty({ example: 'create_user' })
  name: string;

  @IsString()
  @Expose()
  @ApiProperty({ example: 'Create user' })
  description: string;
}
