import { Exclude, Expose, Type } from 'class-transformer';
import { IsOptional, IsPositive, Max } from 'class-validator';

@Exclude()
export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsPositive({ message: 'Page must be a positive number' })
  @Expose()
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsPositive({ message: 'Size must be a positive number' })
  @Max(9999)
  @Expose()
  size?: number;
}
