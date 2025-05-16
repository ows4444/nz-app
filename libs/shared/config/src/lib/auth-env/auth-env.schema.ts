import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class AuthEnvironmentSchema {
  @Expose()
  @IsString()
  @IsNotEmpty()
  PEPPERS!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  PEPPERS_DEFAULT!: string;
}
