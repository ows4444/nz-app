import { ApiProperty } from '@nestjs/swagger';
import { identity } from '@nz/shared-proto';

export class RegisterDto implements identity.RegisterRequest {
  @ApiProperty({ example: 'testuser' })
  username!: string;

  @ApiProperty({ example: 'email@Email.com' })
  email!: string;

  @ApiProperty({ example: 'password' })
  password!: string;
}
