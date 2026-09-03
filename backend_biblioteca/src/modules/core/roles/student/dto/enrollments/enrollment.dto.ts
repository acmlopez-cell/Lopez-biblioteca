import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { isStringValidationOptions } from '@utils/dto-validation';

import {
  CareerEntity,
  SchoolPeriodEntity,
  StudentEntity,
} from '@modules/core/entities';
import { CreateEnrollmentsDetailDto } from '../enrollment-details/create-enrollment-detail.dto';
import { CatalogueEntity } from '@modules/common/catalogue/catalogue.entity';

export class EnrollmentDto {
  @IsNotEmpty()
  readonly student: StudentEntity;

  @IsNotEmpty()
  readonly academicPeriod: CatalogueEntity;

  @IsNotEmpty()
  readonly career: CareerEntity;

  @IsNotEmpty()
  readonly enrollmentDetails: CreateEnrollmentsDetailDto[];

  @IsNotEmpty()
  readonly parallel: CatalogueEntity;

  @IsNotEmpty()
  readonly schoolPeriod: SchoolPeriodEntity;

  @IsNotEmpty()
  readonly type: CatalogueEntity;

  @IsNotEmpty()
  readonly workday: CatalogueEntity;

  @IsOptional()
  @IsString(isStringValidationOptions())
  readonly code: string;

  @IsOptional()
  @IsString(isStringValidationOptions())
  readonly observation: string;
}
