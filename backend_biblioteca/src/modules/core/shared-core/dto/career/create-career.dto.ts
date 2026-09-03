import { PickType } from '@nestjs/swagger';
import { CareerDto } from '@modules/core/shared-core/dto/career/career.dto';

export class CreateCareerDto extends PickType(CareerDto, [
  'code',
  'resolutionNumber',
  'shortName',
  'institutionId',
]) {}
