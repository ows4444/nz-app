import { ApiProperty } from '@nestjs/swagger';
import { LoginRequest } from '../../proto/iam';

export class LoginRequestDto implements LoginRequest {
  @ApiProperty()
  username!: string;

  @ApiProperty()
  password!: string;
}
