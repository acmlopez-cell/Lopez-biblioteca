import { UserEntity } from '@auth/entities';
import { CareerEntity, InformationStudentEntity } from '@modules/core/entities';
import { IsNotEmpty, IsOptional, MinLength, ValidateIf } from 'class-validator';
// import { isNotEmptyValidationOptions } from '@shared/validation';

export class StudentDto {
  @IsOptional()
  user: UserEntity;

  @IsOptional()
  careers: CareerEntity[];

  @IsOptional()
  informationStudent: InformationStudentEntity;
}
