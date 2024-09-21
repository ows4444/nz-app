import { ApiProperty } from '@nestjs/swagger';
import { Expose, Exclude, Transform } from 'class-transformer';
import { IsString } from 'class-validator';

@Exclude()
export class UpdateThemeDto {
  @IsString()
  @Expose()
  @ApiProperty({ example: 'dark' })
  @Transform(({ value }: { value: string }) => value.toLowerCase())
  name: string;

  @IsString()
  @Expose()
  @ApiProperty({ example: 'Dark Theme' })
  description: string;
}
