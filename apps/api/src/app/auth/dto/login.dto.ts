import { Expose, Exclude } from 'class-transformer';
import { IsEmail, IsString, MinLength } from 'class-validator';

@Exclude()
export class LoginDto {
  @IsString()
  @Expose()
  @IsEmail()
  email: string;

  @IsString()
  @Expose()
  @MinLength(8)
  password: string;
}
