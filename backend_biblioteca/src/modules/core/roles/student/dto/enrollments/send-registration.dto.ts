import { IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import {
  CareerEntity,
  EnrollmentDetailEntity,
  SchoolPeriodEntity,
  StudentEntity,
} from '@modules/core/entities';
import { isStringValidationOptions, minLengthValidationOptions } from '@utils/dto-validation';
import { CatalogueEntity } from '@modules/common/catalogue/catalogue.entity';

export class SendRegistrationDto {
  @IsNotEmpty()
  readonly student: StudentEntity;

  @IsNotEmpty()
  readonly academicPeriod: CatalogueEntity;

  @IsNotEmpty()
  readonly career: CareerEntity;

  @IsNotEmpty()
  readonly enrollmentDetails: EnrollmentDetailEntity[];
  // readonly enrollmentDetails: any[];

  @IsNotEmpty()
  readonly parallel: CatalogueEntity;

  @IsNotEmpty()
  readonly schoolPeriod: SchoolPeriodEntity;

  @IsNotEmpty()
  readonly workday: CatalogueEntity;

  @IsOptional()
  @IsString(isStringValidationOptions())
  @Min(5, minLengthValidationOptions())
  readonly observation: string;
}
