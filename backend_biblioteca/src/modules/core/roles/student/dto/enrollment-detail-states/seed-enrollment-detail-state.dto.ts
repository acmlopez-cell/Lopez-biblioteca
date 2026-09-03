import { PickType } from '@nestjs/swagger';
import { EnrollmentStateDto } from '../enrollment-state/enrollment-state.dto';

export class SeedEnrollmentDetailStateDto extends PickType(EnrollmentStateDto, [
  'enrollmentId',
  'stateId',
  'userId',
]) {}
