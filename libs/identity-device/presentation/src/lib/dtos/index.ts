import { ApiProperty } from '@nestjs/swagger';
import { identityDevice } from '@nz/shared-proto';

export class RegisterDto implements identityDevice.RegisterRequest {
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
}
