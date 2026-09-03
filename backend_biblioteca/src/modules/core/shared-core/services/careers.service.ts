import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserEntity } from '@auth/entities';
import { AuthRepositoryEnum, ConfigEnum } from '@utils/enums';
import { FilterCareerDto } from '@modules/core/shared-core/dto';
import { CareerEntity, InstitutionEntity, SchoolPeriodEntity } from '@modules/core/entities';
import { QueryBuilderHelper } from '@modules/core/shared-core/helpers';
import { CoreRepositoryEnum } from '@modules/core/shared-core/enums';

@Injectable()
export class CareersService {
  private readonly searchableFields = ['name', 'shortName', 'resolutionNumber'] as const;

  constructor(
    @Inject(ConfigEnum.PG_DATA_SOURCE) private readonly dataSource: DataSource,
    @Inject(CoreRepositoryEnum.careerRepository) private repository: Repository<CareerEntity>,
    @Inject(AuthRepositoryEnum.userRepository) private userRepository: Repository<UserEntity>,
    @Inject(CoreRepositoryEnum.institutionRepository)
    private institutionRepository: Repository<InstitutionEntity>,
    @Inject(CoreRepositoryEnum.schoolPeriodRepository)
    private schoolPeriodRepository: Repository<SchoolPeriodEntity>,
  ) {}

  async findAll(params: FilterCareerDto) {
    const query = this.repository.createQueryBuilder('career');

    QueryBuilderHelper.applySearch(query, 'career', this.searchableFields, params.search);

    if (params.institutionId) {
      query.andWhere(`career.institution = :institutionId`, {
        institutionId: params.institutionId,
      });
    }

    QueryBuilderHelper.applySorting(query, 'career', params.sort, params.order);

    if (params.page && params.limit)
      QueryBuilderHelper.applyPagination(query, params.page, params.limit);

    const [data, total] = await query.getManyAndCount();

    return { pagination: { totalItems: total, limit: params.limit }, data: data };
  }

  async findOne(id: string): Promise<CareerEntity> {
    const entity = await this.repository.findOne({
      relations: {
        institution: true,
        modality: true,
        state: true,
        type: true,
      },
      where: {
        id,
      },
    });

    if (!entity) {
      throw new NotFoundException(`La carrera con id:  ${id} no se encontró`);
    }

    return entity;
  }

  async loadCareers() {
    return this.repository.find();
  }

  async findInstitutions() {
    return this.institutionRepository.find();
  }

  async findSchoolPeriods() {
    return this.schoolPeriodRepository.find();
  }
}
