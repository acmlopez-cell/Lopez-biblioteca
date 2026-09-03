import { CatalogueEnrollmentStateEnum, CoreRepositoryEnum } from '@modules/core/shared-core/enums';
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateEnrollmentsDetailDto } from '../dto/enrollment-details/create-enrollment-detail.dto';
import { EnrollmentDetailEntity, EnrollmentDetailStateEntity } from '@modules/core/entities';
import { CataloguesService } from '@modules/common/catalogue/catalogue.service';
import { CatalogueTypeEnum } from '@utils/enums';
import { UpdateEnrollmentsDetailDto } from '../dto/enrollment-details/update-enrollment-detail.dto';

export interface ServiceResponseHttpModel {
  data: any;
  pagination?: any;
}

@Injectable()
export class EnrollmentDetailsService {
  constructor(
    @Inject(CoreRepositoryEnum.enrollmentDetailRespository)
    private readonly repository: Repository<EnrollmentDetailEntity>,
    private readonly cataloguesService: CataloguesService,
  ) {}

  async create(
    userId: string,
    payload: CreateEnrollmentsDetailDto,
  ): Promise<EnrollmentDetailEntity> {
    const enrollmentDetailExist = await this.repository.find({
      where: {
        enrollmentId: payload.enrollmentId,
        subjectId: payload.subject.id,
      },
    });

    if (enrollmentDetailExist.length > 0) {
      throw new BadRequestException('La asignatura ya existe, por favor ingrese otra');
    }
    if (
      !payload.enrollmentId ||
      !payload.parallel ||
      !payload.type ||
      !payload.workday ||
      payload.number === undefined
    ) {
      throw new BadRequestException('Información incompleta del detalle de matrícula.');
    }
    const newEnrollmentDetail = this.repository.create();

    newEnrollmentDetail.enrollmentId = payload.enrollmentId;
    newEnrollmentDetail.number = payload.number;
    newEnrollmentDetail.observation = payload.observation ?? '';
    newEnrollmentDetail.parallelId = payload.parallel.id;
    newEnrollmentDetail.subjectId = payload.subject.id;
    newEnrollmentDetail.typeId = payload.type.id;
    newEnrollmentDetail.workdayId = payload.workday.id;

    return await this.repository.save(newEnrollmentDetail);
  }

  async update(id: string, payload: UpdateEnrollmentsDetailDto): Promise<EnrollmentDetailEntity> {
    const enrollmentDetail = await this.repository.findOneBy({ id });

    if (!enrollmentDetail) {
      throw new NotFoundException('Detalle de matrícula no encontrado');
    }

    if (payload.parallel) enrollmentDetail.parallelId = payload.parallel.id;
    if (payload.type) enrollmentDetail.typeId = payload.type.id;
    if (payload.workday) enrollmentDetail.workdayId = payload.workday.id;
    if (payload.date) enrollmentDetail.date = payload.date;
    if (payload.observation) enrollmentDetail.observation = payload.observation;
    if (payload.finalGrade) enrollmentDetail.finalGrade = payload.finalGrade;
    if (payload.finalAttendance) enrollmentDetail.finalAttendance = payload.finalAttendance;
    if (payload.academicState) enrollmentDetail.academicState = payload.academicState;

    return await this.repository.save(enrollmentDetail);
  }

  async removeAll(
    payload: EnrollmentDetailEntity[] | CreateEnrollmentsDetailDto[],
  ): Promise<EnrollmentDetailEntity[]> {
    return await this.repository.softRemove(payload);
  }

  async calculateEnrollmentDetailNumber(studentId: string, subjectId: string): Promise<number> {
    const catalogues = await this.cataloguesService.findCache();

    const enrolled = catalogues.find(
      (catalogue) =>
        catalogue.code === CatalogueEnrollmentStateEnum.ENROLLED &&
        catalogue.type === CatalogueTypeEnum.enrollmentsState,
    );

    const failed = catalogues.find(
      (catalogue) =>
        catalogue.code === 'r' &&
        catalogue.type === CatalogueTypeEnum.enrollmentDetailsEnrollmentsAcademicState,
    );
    return await this.repository.count({
      where: {
        academicStateId: failed!.id,
        subjectId,
        enrollmentDetailState: { stateId: enrolled!.id },
        enrollment: { studentId },
      },
    });
  }

  async countStudentsInSubject(
    subjectId: string,
    parallelId: string,
    workdayId: string,
    schoolPeriodId: string,
  ): Promise<number> {
    const catalogues = await this.cataloguesService.findCache();

    const registeredState = catalogues.find(
      (catalogue) =>
        catalogue.code === CatalogueEnrollmentStateEnum.REGISTERED &&
        catalogue.type === CatalogueTypeEnum.enrollmentsState,
    );

    const enrolledState = catalogues.find(
      (catalogue) =>
        catalogue.code === CatalogueEnrollmentStateEnum.ENROLLED &&
        catalogue.type === CatalogueTypeEnum.enrollmentsState,
    );

    if (!registeredState || !enrolledState) {
      throw new BadRequestException('No se encontraron los estados de matrícula válidos');
    }

    const lastStateQuery = this.repository.manager
      .createQueryBuilder()
      .subQuery()
      .select(
        'DISTINCT ON (eds.enrollment_detail_id) eds.enrollment_detail_id',
        'enrollment_detail_id',
      )
      .addSelect('eds.state_id', 'state_id')
      .from(EnrollmentDetailStateEntity, 'eds')
      .where('eds.deleted_at IS NULL')
      .orderBy('eds.enrollment_detail_id')
      .addOrderBy('eds.created_at', 'DESC')
      .getQuery();

    const result = await this.repository
      .createQueryBuilder('detail')

      .innerJoin('detail.enrollment', 'enrollment')

      .innerJoin(`(${lastStateQuery})`, 'last_state', 'last_state.enrollment_detail_id = detail.id')

      .where('detail.subjectId = :subjectId', {
        subjectId,
      })

      .andWhere('detail.parallelId = :parallelId', {
        parallelId,
      })

      .andWhere('detail.workdayId = :workdayId', {
        workdayId,
      })

      .andWhere('enrollment.schoolPeriodId = :schoolPeriodId', {
        schoolPeriodId,
      })

      .andWhere('last_state.state_id IN (:...states)', {
        states: [registeredState.id, enrolledState.id],
      })

      .select('COUNT(DISTINCT detail.id)', 'count')

      .getRawOne<{ count: string }>();

    return Number(result?.count ?? 0);
  }
}
