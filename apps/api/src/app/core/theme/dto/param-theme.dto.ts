import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsPositive } from 'class-validator';

export class ThemeParamDto {
  @IsPositive()
  @Transform(({ value }) => parseInt(value))
  @ApiProperty({ example: 1, type: Number })
  themeId: number;
}
