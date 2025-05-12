import { ApiProperty } from '@nestjs/swagger';
import { iam } from '@nz/shared-proto';

export class LoginByEmailDto implements iam.LoginByEmailRequest {
  @ApiProperty()
  email!: string;

  @ApiProperty()
  password!: string;
}

export class LoginByUsernameDto implements iam.LoginByUsernameRequest {
  @ApiProperty()
  username!: string;

  @ApiProperty()
  password!: string;
}

export class RegisterDto implements iam.RegisterRequest {
  @ApiProperty()
  username!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  password!: string;
}
