import { PaginationDto } from '@utils/pagination';
import { IsNumber, IsOptional, IsString, IsDate } from 'class-validator';

export class FilterEnrollmentStateDto extends PaginationDto {
  @IsOptional()
  @IsNumber()
  readonly number: number;

  @IsOptional()
  @IsDate()
  readonly date: Date;
}
