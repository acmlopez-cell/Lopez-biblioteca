import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CoreRepositoryEnum } from '@modules/core/shared-core/enums';
import { EnrollmentEntity } from '@modules/core/entities';
import { CataloguesService } from '@modules/common/catalogue/catalogue.service';

@Injectable()
export class EnrollmentSqlService {
  constructor(
    @Inject(CoreRepositoryEnum.enrollmentRepository)
    private readonly repository: Repository<EnrollmentEntity>,
    private readonly cataloguesService: CataloguesService,
  ) {}
  // el rporte
  async findEnrollmentCertificateByEnrollment(id: string): Promise<EnrollmentEntity> {
    const enrollment = await this.repository.findOne({
      relations: {
        academicPeriod: true,
        career: { institution: true },
        parallel: true,
        workday: true,
        schoolPeriod: true,
        enrollmentDetails: {
          parallel: true,
          workday: true,
          subject: { academicPeriod: true },
          enrollmentDetailStates: { state: true },
        },
        enrollmentStates: {
          state: true,
        },
        student: { user: true },
      },
      where: { id },
    });
    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }
    return enrollment;
  }
}
