import { CatalogueEntity } from '@modules/common/catalogue/catalogue.entity';
import { StudentEntity } from '@modules/core/entities';
import {
  isNotEmptyValidationOptions,
  isNumberValidationOptions,
  isStringValidationOptions,
} from '@utils/dto-validation';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  MaxLength,
  Min,
  Max,
  IsOptional,
  ValidateIf,
  IsBoolean,
} from 'class-validator';

export class InformationStudentDto {
  @IsNotEmpty(isNotEmptyValidationOptions())
  readonly student: StudentEntity;

  @IsOptional()
  readonly career: CatalogueEntity;

  @IsOptional()
  readonly academicPeriod: CatalogueEntity;

  @IsOptional()
  readonly contactEmergencyKinship: CatalogueEntity;

  @IsString(isStringValidationOptions())
  @MaxLength(1000, { message: 'Maximo 1000 caracteres' })
  readonly address: string;

  /* Eliminado porque no existe en InformationStudentEntity
  @IsNumber({}, isNumberValidationOptions())
  @Min(0, { message: 'El número de digitos mínimo es 0.' })
  readonly community: number;
  */

  @IsString(isStringValidationOptions())
  @MaxLength(255, { message: 'Maximo 255 caracteres' })
  readonly contactEmergencyName: string;

  @IsString(isStringValidationOptions())
  @MaxLength(255, { message: 'Maximo 255 caracteres' })
  readonly contactEmergencyPhone: string;

  // --- VALIDACIONES DE TRABAJO ---
  @IsBoolean()
  @IsOptional()
  readonly isWork: boolean;

  @ValidateIf((o: InformationStudentDto) => o.isWork)
  @IsString(isStringValidationOptions())
  readonly workAddress: string;

  @ValidateIf((o: InformationStudentDto) => o.isWork)
  @IsString(isStringValidationOptions())
  readonly workPosition: string;

  @ValidateIf((o: InformationStudentDto) => o.isWork)
  @IsOptional()
  readonly monthlySalary: CatalogueEntity;

  @ValidateIf((o: InformationStudentDto) => o.isWork)
  @IsOptional()
  readonly workingHours: CatalogueEntity;

  // --- ESTADO SOCIAL ---
  @IsBoolean()
  @IsOptional()
  readonly isHouseHead: boolean;

  @IsBoolean()
  @IsOptional()
  readonly isSocialSecurity: boolean;

  @IsBoolean()
  @IsOptional()
  readonly isPrivateSecurity: boolean;

  // --- ORIGEN (Para validación cruzada con usuario) --- esta realmente vinculada a origen etnico de user ? en user es obligatorio
  // @IsOptional()
  // readonly indigenousNationality: CatalogueEntity;

  // @IsOptional()
  // readonly town: CatalogueEntity;
  @IsNotEmpty(isNotEmptyValidationOptions())
  readonly indigenousNationality: CatalogueEntity;

  @IsNotEmpty(isNotEmptyValidationOptions())
  readonly town: CatalogueEntity;
  // --- VALIDACIONES CONDICIONALES EXISTENTES ---
  @IsBoolean()
  @IsOptional() // Usualmente es mejor IsOptional o predeterminarlo en el cliente
  readonly isHasChildren: boolean;

  @ValidateIf((o: InformationStudentDto) => o.isHasChildren)
  @IsNumber({}, isNumberValidationOptions())
  @Min(1, { message: 'Debe tener al menos 1 hijo si indicó que tiene hijos.' })
  readonly childrenTotal: number;

  @IsBoolean()
  @IsOptional()
  readonly isDisability: boolean;

  @ValidateIf((o: InformationStudentDto) => o.isDisability)
  @IsNotEmpty(isNotEmptyValidationOptions())
  readonly disabilityType: CatalogueEntity;

  @ValidateIf((o: InformationStudentDto) => o.isDisability)
  @IsNumber({}, isNumberValidationOptions())
  @Min(1, { message: 'El porcentaje mínimo es 1.' })
  @Max(100, { message: 'Maximo 100 digito' })
  readonly disabilityPercentage: number;

  @IsBoolean()
  @IsOptional()
  readonly isAncestralLanguage: boolean;

  @ValidateIf((o: InformationStudentDto) => o.isAncestralLanguage)
  @IsNotEmpty(isNotEmptyValidationOptions())
  readonly ancestralLanguageName: CatalogueEntity;

  @IsBoolean()
  @IsOptional()
  readonly isForeignLanguage: boolean;

  @ValidateIf((o: InformationStudentDto) => o.isForeignLanguage)
  @IsNotEmpty(isNotEmptyValidationOptions())
  readonly foreignLanguageName: CatalogueEntity;

  @IsBoolean()
  @IsOptional()
  readonly isCatastrophicIllness: boolean;

  @ValidateIf((o: InformationStudentDto) => o.isCatastrophicIllness)
  @IsString(isStringValidationOptions())
  readonly catastrophicIllness: string;
}
