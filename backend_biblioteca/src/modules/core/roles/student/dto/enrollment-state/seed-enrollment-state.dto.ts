import { PickType } from '@nestjs/swagger';
import { EnrollmentStateDto } from './enrollment-state.dto';

export class SeedEnrollmentStateDto extends PickType(EnrollmentStateDto, [
  'enrollmentId',
  'stateId',
  'userId',
]) {}
