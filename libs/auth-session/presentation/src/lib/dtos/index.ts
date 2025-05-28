import { ApiProperty } from '@nestjs/swagger';
import { auth } from '@nz/shared-proto';

export class LoginByEmailDto implements auth.LoginByEmailRequest {
  @ApiProperty({ example: 'email@Email.com' })
  email!: string;

  @ApiProperty({ example: 'password' })
  password!: string;
}

export class LoginByUsernameDto implements auth.LoginByUsernameRequest {
  @ApiProperty({ example: 'testuser' })
  username!: string;

  @ApiProperty({ example: 'password' })
  password!: string;
}
