import { IsOptional, ValidateNested } from 'class-validator';
import { PaginationDto } from './pagination.dto';
import { SortDto } from './sort.dto';
import { IntersectionType } from '@nestjs/mapped-types';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class SortWithPaginationDto<T = object> extends IntersectionType(PaginationDto, SortDto) {
  @IsOptional()
  @ValidateNested()
  @Type(() => Object)
  @Expose()
  params?: T;
}
