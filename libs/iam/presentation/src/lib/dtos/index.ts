import { ApiProperty } from '@nestjs/swagger';
import { auth } from '@nz/shared-proto';

export class LoginByEmailDto implements auth.LoginByEmailRequest {
  @ApiProperty()
  email!: string;

  @ApiProperty()
  password!: string;
}

export class LoginByUsernameDto implements auth.LoginByUsernameRequest {
  @ApiProperty()
  username!: string;

  @ApiProperty()
  password!: string;
}

export class RegisterDto implements auth.RegisterRequest {
  @ApiProperty({ example: 'testuser' })
  username!: string;

  @ApiProperty({ example: 'email@Email.com' })
  email!: string;

  @ApiProperty({ example: 'password' })
  password!: string;
}
