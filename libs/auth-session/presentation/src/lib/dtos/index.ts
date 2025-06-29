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

export class RegisterDto implements authSession.RegisterRequest {
  @ApiProperty({ example: 'fname' })
  firstName!: string;

  @ApiProperty({ example: 'lname' })
  lastName!: string;

  @ApiProperty({ example: 'testuser' })
  username!: string;

  @ApiProperty({ example: 'email@Email.com' })
  email!: string;

  @ApiProperty({ example: 'password' })
  password!: string;

  @ApiProperty({ example: '12345-67890-abcde-00000' })
  deviceId!: string;

  @ApiProperty({ example: '{"ABCD":"XYZ"}' })
  deviceInfo!: string;
}
