import { Exclude, Expose, Type } from 'class-transformer';
import { IsEnum, IsOptional, MinLength } from 'class-validator';

@Exclude()
export class SortDto {
  @IsOptional()
  @Type(() => String)
  @MinLength(1, { message: 'Sort must be min 1 char long ' })
  @Expose()
  sort?: string;

  @IsOptional()
  @IsEnum(['asc', 'desc'], { message: 'Order must be asc or desc' })
  @Expose()
  order?: string;
}
