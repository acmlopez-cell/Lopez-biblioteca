import { isStringValidationOptions } from '@utils/dto-validation';
import { PaginationDto } from '@utils/pagination';
import { IsOptional, IsString } from 'class-validator';

export class FilterStudentDto extends PaginationDto {
  @IsOptional()
  @IsString(isStringValidationOptions())
  readonly name: string;
}
