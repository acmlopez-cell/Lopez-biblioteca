import {  SubjectEntity } from '@modules/core/entities';
import {
  isStringValidationOptions,
  maxValidationOptions,
  minValidationOptions,
} from '@utils/dto-validation';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { CatalogueEntity } from '@modules/common/catalogue/catalogue.entity';

export class EnrollmentsDetailDto {
  @IsOptional()
  readonly academicState?: CatalogueEntity;

  // OPCIONAL: Porque se asigna en el backend al guardar el Enrollment
  @IsOptional()
  readonly enrollmentId?: string;

  // OBLIGATORIO: Es lo único que realmente nos importa saber (qué materia va a tomar)
  @IsNotEmpty()
  readonly subject: SubjectEntity;

  @IsOptional()
  readonly subjectId?: string;

  // OPCIONALES: Porque el servicio los toma del Enrollment principal
  @IsOptional()
  readonly parallel?: CatalogueEntity;
  @IsOptional()
  readonly parallelId?: string;

  @IsOptional()
  readonly type?: CatalogueEntity;
  @IsOptional()
  readonly typeId?: string;

  @IsOptional()
  readonly workday?: CatalogueEntity;
  @IsOptional()
  readonly workdayId?: string;

  // OPCIONAL: El servicio calcula el número de matrícula (1, 2 o 3)
  @IsOptional()
  @IsNumber({}, { message: 'El campo number debe ser un número' })
  @Min(1, minValidationOptions())
  @Max(3, maxValidationOptions())
  readonly number?: number;

  // OPCIONAL: El alumno puede no enviar observación
  @IsOptional()
  @IsString(isStringValidationOptions())
  readonly observation?: string;

  @IsOptional()
  @IsNumber()
  readonly finalGrade?: number;

  @IsOptional()
  @IsNumber()
  readonly finalAttendance?: number;
}
