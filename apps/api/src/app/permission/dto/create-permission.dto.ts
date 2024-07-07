import { Expose, Exclude } from 'class-transformer';
import { IsString } from 'class-validator';

@Exclude()
export class CreatePermissionDto {
  @IsString()
  @Expose()
  name: string;

  @IsString()
  @Expose()
  description: string;
}
