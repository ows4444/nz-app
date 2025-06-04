import { ApiProperty } from '@nestjs/swagger';
import { userDevice } from '@nz/shared-proto';

export class RegisterDto implements userDevice.RegisterRequest {
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
