import { PartialType } from '@nestjs/swagger';
import { CreateInformationStudentDto } from './create-information-student.dto';

export class UpdateInformationStudentDto extends PartialType(CreateInformationStudentDto) {}
