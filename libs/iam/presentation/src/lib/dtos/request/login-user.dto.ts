import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class LoginUserDto {
  @ApiPropertyOptional({
    description: 'Username (provide either username or email)',
    example: 'testuser',
  })
  @ValidateIf((o) => !o.email)
  @IsString()
  @IsNotEmpty()
  username?: string;

  @ApiPropertyOptional({
    description: 'Email address (provide either email or username)',
    example: 'email@example.com',
  })
  @ValidateIf((o) => !o.username)
  @IsEmail()
  @IsNotEmpty()
  email?: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'password123',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  password!: string;
}
