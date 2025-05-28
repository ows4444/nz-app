import { ApiProperty } from '@nestjs/swagger';
import { authSession } from '@nz/shared-proto';

export class LoginByEmailDto implements authSession.LoginByEmailRequest {
  @ApiProperty({ example: 'email@Email.com' })
  email!: string;

  @ApiProperty({ example: 'password' })
  password!: string;
}

export class LoginByUsernameDto implements authSession.LoginByUsernameRequest {
  @ApiProperty({ example: 'testuser' })
  username!: string;

  @ApiProperty({ example: 'password' })
  password!: string;
}
