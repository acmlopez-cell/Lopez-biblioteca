import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetAvailableSubjectsDto {
  @ApiProperty({ description: 'ID de la Carrera' })
  @IsUUID()
  @IsNotEmpty()
  careerId: string;

  @ApiProperty({ description: 'ID de la Malla (School Period)' })
  @IsUUID()
  @IsNotEmpty()
  schoolPeriodId: string;

  @ApiProperty({ description: 'ID del Periodo Académico (Semestre)' })
  @IsUUID()
  @IsNotEmpty()
  academicPeriodId: string;

  @ApiProperty({ description: 'ID de la Jornada (Workday)' })
  @IsUUID()
  @IsNotEmpty()
  workdayId: string;

  @ApiProperty({ description: 'ID del Paralelo' })
  @IsUUID()
  @IsNotEmpty()
  parallelId: string;

  // TODO: institutionId - Agregar aquí cuando se defina de dónde proviene (si se pasa por header, token o parámetro).
  // @IsUUID()
  // @IsOptional()
  // institutionId?: string;
}
