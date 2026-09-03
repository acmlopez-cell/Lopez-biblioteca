import { TeacherDistributionEntity } from '@modules/core/entities';
import { CoreRepositoryEnum } from '@modules/core/shared-core/enums';
import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class TeacherDistributionService {
  constructor(
    @Inject(CoreRepositoryEnum.teacherDistributionRepository)
    private repository: Repository<TeacherDistributionEntity>,
  ) {}
  async findBySchoolPeriod(schoolPeriodId: string) {
    const response = await this.repository.find({
      where: {
        schoolPeriodId,
      },
      relations: {
        schoolPeriod: true,
        workday: true,
        parallel: true,
        subject: {
          academicPeriod: true,
          career: true,
        },
      },
    });
    return response;
  }
}
