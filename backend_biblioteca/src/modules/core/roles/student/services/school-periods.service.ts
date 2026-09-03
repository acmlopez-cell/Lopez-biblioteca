import { SchoolPeriodEntity } from '@modules/core/entities';
import { CatalogueSchoolPeriodCodeEnum, CoreRepositoryEnum } from '@modules/core/shared-core/enums';
import { ServiceResponseHttpModel } from './enrollment-details.service';
import { MessageEnum } from '@utils/enums';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class SchoolPeriodsService {
  constructor(
    @Inject(CoreRepositoryEnum.schoolPeriodRepository)
    private repository: Repository<SchoolPeriodEntity>,
  ) {}

  async catalogue(): Promise<ServiceResponseHttpModel> {
    const response = await this.repository.findAndCount({
      relations: { state: true },
      take: 1000,
    });

    return {
      data: response[0],
      pagination: {
        totalItems: response[1],
        limit: 1000,
      },
    };
  }

  async findOpenSchoolPeriod(): Promise<SchoolPeriodEntity> {
    const entity = await this.repository.findOne({
      where: {
        state: { code: CatalogueSchoolPeriodCodeEnum.opened },
      },
    });

    if (!entity) {
      throw new NotFoundException(MessageEnum.NOT_FOUND);
    }

    return entity;
  }
}
