import { PartialType } from '@nestjs/mapped-types';
import { CreateEnrollmentsDetailDto } from '../enrollment-details/create-enrollment-detail.dto';

export class UpdateEnrollmentDetailStateDto extends PartialType(CreateEnrollmentsDetailDto) {}
