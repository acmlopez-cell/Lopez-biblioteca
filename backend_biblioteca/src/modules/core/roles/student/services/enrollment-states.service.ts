import { EnrollmentStateEntity } from '@modules/core/entities';
import { CoreRepositoryEnum } from '@modules/core/shared-core/enums';
import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateEnrollmentStateDto } from '../dto/enrollment-state/create-enrollment-state.dto';
import { SeedEnrollmentStateDto } from '../dto/enrollment-state/seed-enrollment-state.dto';

@Injectable()
export class EnrollmentStatesService {
  constructor(
    @Inject(CoreRepositoryEnum.enrollmentStateRepository)
    private repository: Repository<EnrollmentStateEntity>,
  ) {}
  //usar
  async create(
    payload: CreateEnrollmentStateDto | SeedEnrollmentStateDto,
  ): Promise<EnrollmentStateEntity> {
    const newEntity = this.repository.create(payload);
    newEntity.enrollmentId = payload.enrollmentId;
    newEntity.stateId = payload.stateId;

    return await this.repository.save(newEntity);
  }
  //usar
  async removeAll(payload: EnrollmentStateEntity[]): Promise<EnrollmentStateEntity[]> {
    return await this.repository.softRemove(payload);
  }
}
