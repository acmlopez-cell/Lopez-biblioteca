import { isNumberValidationOptions, isStringValidationOptions } from '@utils/dto-validation';
import { PaginationDto } from '@utils/pagination';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class FilterInformationStudentDto extends PaginationDto {
  @IsOptional()
  @IsNumber({}, isNumberValidationOptions())
  readonly community: number;

  @IsOptional()
  @IsString(isStringValidationOptions())
  readonly contactEmergencyName: string;

  @IsOptional()
  @IsString(isStringValidationOptions())
  readonly contactEmergencyKinship: string;

  @IsOptional()
  @IsString(isStringValidationOptions())
  readonly contactEmergencyPhone: string;

  @IsOptional()
  @IsString(isStringValidationOptions())
  readonly postalCode: string;
}
