import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AuthRepositoryEnum } from '@utils/enums';

import { UserEntity } from '@auth/entities';
import { CatalogueEnrollmentStateEnum, CoreRepositoryEnum } from '@modules/core/shared-core/enums';
import { EnrollmentEntity } from '@modules/core/entities';

@Injectable()
export class PdfSql {
  constructor(
    @Inject(AuthRepositoryEnum.userRepository)
    private readonly userRepository: Repository<UserEntity>,
    @Inject(CoreRepositoryEnum.enrollmentRepository)
    private readonly enrollmentRepository: Repository<EnrollmentEntity>,
  ) {}

  async findLatestRegistrationByStudent(studentId: string): Promise<any> {
    const enrollments = await this.enrollmentRepository.find({
      where: { studentId },
      relations: {
        student: { user: true },
        career: true,
        workday: true,
        parallel: true,
        schoolPeriod: true,
        academicPeriod: true,
        enrollmentDetails: {
          subject: true,
        },
        enrollmentStates: {
          state: true,
        },
      },
      order: {
        createdAt: 'DESC',
      },
    });
    const latestEnrollment = enrollments[0];

    if (!latestEnrollment) {
      throw new NotFoundException(
        'El estudiante no tiene ninguna matrícula registrada en el sistema.',
      );
    }

    const sortedStates = latestEnrollment.enrollmentStates.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );

    const currentState = sortedStates[0]?.state;

    if (!currentState) {
      throw new NotFoundException('La matrícula actual no tiene ningún estado asignado.');
    }

    if (currentState.code !== CatalogueEnrollmentStateEnum.REGISTERED) {
      console.log('Estado actual de la matrícula:', currentState.code);
      throw new NotFoundException(
        `No se puede generar el reporte. La matrícula más reciente no está en estado "registered". Estado actual: "${currentState.code}".`,
      );
    }
    return {
      registration: latestEnrollment,
    };
  }
}
