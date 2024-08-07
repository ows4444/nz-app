import { ApiProperty } from '@nestjs/swagger';
import { Expose, Exclude } from 'class-transformer';
import { IsEmail, IsString, MinLength } from 'class-validator';

@Exclude()
export class LoginDto {
  @IsString()
  @Expose()
  @IsEmail()
  @ApiProperty({ example: 'root@nizaami.com' })
  email: string;

  @IsString()
  @Expose()
  @MinLength(8)
  @ApiProperty({ example: 'rootroot' })
  password: string;
}
