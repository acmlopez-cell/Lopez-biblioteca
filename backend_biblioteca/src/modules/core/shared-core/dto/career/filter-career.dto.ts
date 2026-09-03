import { PickType } from '@nestjs/swagger';
import { PaginationDto } from '@utils/pagination';
import { IsIn, IsOptional } from 'class-validator';
import { isInValidationOptions } from '@utils/dto-validation';
import { InstitutionEntity } from '@modules/core/entities';

const sortableFields = ['code', 'shortName', 'resolutionNumber'] as const;

export class FilterCareerDto extends PickType(PaginationDto, ['page', 'limit', 'order', 'search']) {
  @IsOptional()
  @IsIn(sortableFields, isInValidationOptions())
  sort: string;

  @IsOptional()
  institutionId: string;

  @IsOptional()
  schoolPeriodId: string;
}
