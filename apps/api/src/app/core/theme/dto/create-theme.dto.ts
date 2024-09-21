import { ApiProperty } from '@nestjs/swagger';
import { Expose, Exclude, Transform } from 'class-transformer';
import { IsString } from 'class-validator';

@Exclude()
export class CreateThemeDto {
  @IsString()
  @Expose()
  @ApiProperty({ example: 'p' })
  @Transform(({ value }: { value: string }) => value.toUpperCase())
  name: string;

  @IsString()
  @Expose()
  @ApiProperty({ example: 'Paragraph' })
  description: string;
}
