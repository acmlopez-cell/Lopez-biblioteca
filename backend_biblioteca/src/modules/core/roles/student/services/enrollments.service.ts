import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { In, Not, Repository, SelectQueryBuilder } from 'typeorm';
import {
  CatalogueEnrollmentsAcademicStateEnum,
  CatalogueEnrollmentStateEnum,
  CatalogueSchoolPeriodTypeEnum,
  CoreRepositoryEnum,
} from '@modules/core/shared-core/enums';
import { EnrollmentDetailsService } from './enrollment-details.service';
import { CataloguesService } from '@modules/common/catalogue/catalogue.service';
import { UpdateEnrollmentDto } from '../dto/enrollments/update-enrollment.dto';
import { CatalogueTypeEnum } from '@utils/enums';
import { EnrollmentStatesService } from './enrollment-states.service';
import { EnrollmentDetailStatesService } from './enrollment-detail-states.service';
import { isAfter, isBefore } from 'date-fns';
import {
  EnrollmentDetailEntity,
  EnrollmentDetailStateEntity,
  EnrollmentEntity,
  SchoolPeriodEntity,
  SubjectEntity,
  TeacherDistributionEntity,
} from '@modules/core/entities';
import { SchoolPeriodsService } from './school-periods.service';
import { EnrollmentDto } from '../dto/enrollments/enrollment.dto';
import { GetAvailableSubjectsDto } from '../dto/enrollments/get-available-subjects.dto';
import { CreateEnrollmentsDetailDto } from '../dto/enrollment-details/create-enrollment-detail.dto';
import { CatalogueEntity } from '@modules/common/catalogue/catalogue.entity';

@Injectable()
export class EnrollmentsService {
  constructor(
    @Inject(CoreRepositoryEnum.enrollmentRepository)
    private readonly repository: Repository<EnrollmentEntity>,
    private readonly enrollmentsStateService: EnrollmentStatesService,
    private readonly enrollmentDetailsService: EnrollmentDetailsService,
    private readonly enrollmentDetailStatesService: EnrollmentDetailStatesService,
    private readonly cataloguesService: CataloguesService,
    private readonly schoolPeriodsService: SchoolPeriodsService,
    @Inject(CoreRepositoryEnum.teacherDistributionRepository)
    private readonly teacherDistributionRepository: Repository<TeacherDistributionEntity>,
    @Inject(CoreRepositoryEnum.subjectRepository)
    private readonly subjectRepository: Repository<SubjectEntity>,
  ) {}

  async sendRegistration(userId: string, payload: EnrollmentDto): Promise<EnrollmentEntity> {

    if (!payload.student) throw new Error('payload.student es undefined');
    if (!payload.career) throw new Error('payload.career es undefined');
    if (!payload.schoolPeriod) throw new Error('payload.schoolPeriod es undefined');
    if (!payload.academicPeriod) throw new Error('payload.academicPeriod es undefined');
    if (!payload.parallel) throw new Error('payload.parallel es undefined');
    if (!payload.workday) throw new Error('payload.workday es undefined');

    let enrollment = await this.repository.findOne({
      relations: {
        enrollmentStates: { state: true },
        enrollmentDetails: true,
      },
      where: {
        studentId: payload.student.id,
        careerId: payload.career.id,
        schoolPeriodId: payload.schoolPeriod.id,
      },
    });

    if (!enrollment) {
      enrollment = this.repository.create();
    }

    enrollment.academicPeriodId = payload.academicPeriod.id;
    enrollment.careerId = payload.career.id;
    enrollment.parallelId = payload.parallel.id;
    enrollment.schoolPeriodId = payload.schoolPeriod.id;
    enrollment.studentId = payload.student.id;
    enrollment.workdayId = payload.workday.id;
    enrollment.typeId = payload.type?.id || (null as unknown as string);
    enrollment.observation = payload.observation || (null as unknown as string);
    enrollment.applicationsAt = new Date();

    enrollment = await this.repository.save(enrollment);

    const catalogues = await this.cataloguesService.findCache();
    const registeredState = catalogues.find(
      (catalogue) =>
        catalogue.code === CatalogueEnrollmentStateEnum.REGISTERED &&
        catalogue.type === CatalogueTypeEnum.enrollmentsState,
    );

    if (!registeredState) {
      throw new BadRequestException('El estado REGISTERED no fue encontrado en los catálogos');
    }

    if (!enrollment.enrollmentStates?.length) {
      await this.enrollmentsStateService.create({
        enrollmentId: enrollment.id,
        stateId: registeredState.id,
        userId,
        date: new Date(),
        observation: payload.observation ?? '',
      });
    }

    if (enrollment.enrollmentDetails?.length) {
      await this.enrollmentDetailsService.removeAll(enrollment.enrollmentDetails);
    }
  
    for (const item of payload.enrollmentDetails) {
      if (!item.subject) {
        throw new Error('item.subject es undefined');
      }
      const teacherDistribution = await this.teacherDistributionRepository.findOne({
        where: {
          subjectId: item.subject.id,
          parallelId: enrollment.parallelId,
          workdayId: enrollment.workdayId,
          schoolPeriodId: enrollment.schoolPeriodId,
        },
      });
      if (!teacherDistribution) {
        throw new BadRequestException(
          'No se encontró una distribución docente para la materia seleccionada.',
        );
      }

      const enrolledCount = await this.enrollmentDetailsService.countStudentsInSubject(
        item.subject.id,
        enrollment.parallelId,
        enrollment.workdayId,
        enrollment.schoolPeriodId,
      );

      if (teacherDistribution.capacity !== null && enrolledCount >= teacherDistribution.capacity) {
        throw new BadRequestException('No existen cupos disponibles para la materia solicitada.');
      }

      let enrollmentNumber = await this.calculateEnrollmentDetailNumber(
        payload.student.id,
        item.subject.id,
      );
      console.log('enrollmentNumber:', enrollmentNumber);
      enrollmentNumber++;

      if (enrollmentNumber > 3) {
        continue;
      }

      const enrollmentDetail: CreateEnrollmentsDetailDto = {
        enrollmentId: enrollment.id,
        subject: {
          id: item.subject.id,
        } as SubjectEntity,
        parallel: {
          id: enrollment.parallelId,
        } as CatalogueEntity,
        type: {
          id: enrollment.typeId,
        } as CatalogueEntity,
        workday: {
          id: enrollment.workdayId,
        } as CatalogueEntity,
        number: enrollmentNumber,
        observation: payload.observation,
      };

      const enrollmentDetailCreated = await this.enrollmentDetailsService.create(
        userId,
        enrollmentDetail,
      );

      if (!enrollmentDetailCreated) {
        throw new Error('EL ERROR ESTÁ AQUÍ: enrollmentDetailsService.create devolvió undefined.');
      }
      await this.enrollmentDetailStatesService.create({
        enrollmentDetailId: enrollmentDetailCreated.id,
        stateId: registeredState.id,
        userId,
        date: new Date(),
        observation: payload.observation ?? '',
      });
    }

    return enrollment;
  }

  async sendRequest(
    userId: string,
    id: string,
    payload: UpdateEnrollmentDto,
  ): Promise<EnrollmentEntity> {
    let enrollment = await this.repository.findOne({
      relations: { enrollmentDetails: { enrollmentDetailStates: true }, enrollmentStates: true },
      where: { id },
    });

    if (!enrollment) {
      throw new NotFoundException(`La matrícula con ID ${id} no existe`);
    }

    const targetSchoolPeriod = payload.schoolPeriod || { id: enrollment.schoolPeriodId };

    const catalogueType = await this.getType(targetSchoolPeriod);

    if (!catalogueType) {
      throw new NotFoundException('Catalogue type not found');
    }

    const catalogues = await this.cataloguesService.findCache();
    const requestSentState = catalogues.find(
      (catalogue) =>
        catalogue.code === CatalogueEnrollmentStateEnum.REQUEST_SENT &&
        catalogue.type === CatalogueTypeEnum.enrollmentsState,
    );

    if (!requestSentState) {
      throw new BadRequestException('El estado REQUEST_SENT no fue encontrado en los catálogos');
    }

    enrollment.applicationsAt = new Date();
    enrollment.typeId = catalogueType.id;
    enrollment.observation = payload.observation || (null as unknown as string);

    enrollment = await this.repository.save(enrollment);

    if (enrollment.enrollmentStates && enrollment.enrollmentStates.length > 0) {
      await this.enrollmentsStateService.removeAll(enrollment.enrollmentStates);
    }

    await this.enrollmentsStateService.create({
      enrollmentId: enrollment.id,
      stateId: requestSentState.id,
      userId,
      date: new Date(),
      observation: payload.observation ?? '',
    });

    for (const item of enrollment.enrollmentDetails) {
      item.type = { id: catalogueType.id } as CatalogueEntity;

      await this.enrollmentDetailsService.update(item.id, item);

      await this.enrollmentDetailStatesService.create({
        enrollmentDetailId: item.id,
        stateId: requestSentState.id,
        userId,
        date: new Date(),
        observation: payload.observation ?? '',
      });
    }

    return enrollment;
  }

  async findTotalEnrollments(
    enrollmentId: string,
    careerId: string,
    parallelId: string,
    schoolPeriodId: string,
    workdayId: string,
    academicPeriodId: string,
  ): Promise<number> {
    const catalogues = await this.cataloguesService.findCache();

    const states = catalogues.filter(
      (item) =>
        item.code != CatalogueEnrollmentStateEnum.REVOKED &&
        item.type === CatalogueTypeEnum.enrollmentsState,
    );

    const statesId = states.map((state) => state.id);

    let total: EnrollmentEntity[] = [];

    if (enrollmentId) {
      total = await this.repository.find({
        where: {
          id: Not(enrollmentId),
          academicPeriodId,
          workdayId,
          parallelId,
          schoolPeriodId,
          careerId,
          enrollmentStates: { stateId: In(statesId) },
        },
      });
    } else {
      total = await this.repository.find({
        where: {
          academicPeriodId,
          workdayId,
          parallelId,
          schoolPeriodId,
          careerId,
          enrollmentStates: { stateId: In(statesId) },
        },
      });
    }

    return total.length;
  }

  async calculateEnrollmentDetailNumber(studentId: string, subjectId: string): Promise<number> {
    const count = await this.enrollmentDetailsService.calculateEnrollmentDetailNumber(
      studentId,
      subjectId,
    );
    return count;
  }

  private async getType(schoolPeriod: SchoolPeriodEntity) {
    const currentDate = new Date();
    const catalogues = await this.cataloguesService.findCache();

    let codeType = CatalogueSchoolPeriodTypeEnum.ESPECIAL;

    // Solo evaluar fechas si el objeto schoolPeriod tiene esas propiedades cargadas
    if (schoolPeriod.ordinaryStartedAt && schoolPeriod.ordinaryEndedAt) {
      if (
        isAfter(currentDate, new Date(schoolPeriod.ordinaryStartedAt)) &&
        isBefore(currentDate, new Date(schoolPeriod.ordinaryEndedAt))
      ) {
        codeType = CatalogueSchoolPeriodTypeEnum.ORDINARY;
      }

      if (
        isAfter(currentDate, new Date(schoolPeriod.extraOrdinaryStartedAt)) &&
        isBefore(currentDate, new Date(schoolPeriod.extraOrdinaryEndedAt))
      ) {
        codeType = CatalogueSchoolPeriodTypeEnum.EXTRAORDINARY;
      }

      if (
        isAfter(currentDate, new Date(schoolPeriod.especialStartedAt)) &&
        isBefore(currentDate, new Date(schoolPeriod.especialEndedAt))
      ) {
        codeType = CatalogueSchoolPeriodTypeEnum.ESPECIAL;
      }
    }

    const type = catalogues.find((type) => {
      return type.code === codeType && type.type === CatalogueTypeEnum.enrollmentsType;
    });

    return type;
  }

  async findEnrollmentByStudent(studentId: string): Promise<EnrollmentEntity> {
    const openSchoolPeriod = await this.schoolPeriodsService.findOpenSchoolPeriod();

    const enrollment = await this.repository.findOne({
      relations: {
        academicPeriod: true,
        parallel: true,
        workday: true,
        schoolPeriod: true,
        career: true,
        enrollmentDetails: { subject: true },
        enrollmentStates: {
          state: true,
        },
        enrollmentState: {
          state: true,
        },
      },
      where: { studentId, schoolPeriodId: openSchoolPeriod.id },
    });
    if (!enrollment) {
      throw new NotFoundException('La informacion no se encontro');
    }
    return enrollment;
  }

  async findEnrollmentsByStudent(studentId: string): Promise<EnrollmentDetailEntity | null> {
    const enrollments = await this.repository.find({
      relations: {
        enrollmentDetails: {
          subject: { type: true, academicPeriod: true },
          academicState: true,
          enrollmentDetailStates: { state: true },
          enrollmentDetailState: { state: true },
        },
      },
      where: {
        studentId,
        enrollmentDetails: {
          academicState: { code: CatalogueEnrollmentsAcademicStateEnum.APPROVED },
        },
      },
    });
    const enrollmentDetails: EnrollmentDetailEntity[] = [];

    for (const item of enrollments) {
      enrollmentDetails.push(...item.enrollmentDetails);
    }
    //review aumentar campo state en enrollment y enrollmentDetail para que se duplique y tome el ultimo valor

    if (enrollmentDetails.length === 0) return null;

    enrollmentDetails.sort((a, b) => {
      return Number(b.subject.academicPeriod.code) - Number(a.subject.academicPeriod.code);
    });

    return enrollmentDetails[0];
  }

  private getLastEnrollmentDetailStateQuery(qb: SelectQueryBuilder<any>) {
    return qb
      .select(
        'DISTINCT ON (eds.enrollment_detail_id) eds.enrollment_detail_id',
        'enrollment_detail_id',
      )
      .addSelect('eds.state_id', 'state_id')
      .from(EnrollmentDetailStateEntity, 'eds')
      .where('eds.deleted_at IS NULL')
      .orderBy('eds.enrollment_detail_id')
      .addOrderBy('eds.created_at', 'DESC');
  }

  async getAvailableSubjects(dto: GetAvailableSubjectsDto) {
    try {
      const { careerId, academicPeriodId, schoolPeriodId, workdayId, parallelId } = dto;
      const occupiedCount = `
COUNT(
  DISTINCT CASE
    WHEN enrollment.id IS NOT NULL
     AND state.code IN ('registered','request_sent','enrolled')
    THEN detail.id
  END
)
`;
      const query = this.subjectRepository
        .createQueryBuilder('subject')

        .innerJoin(
          TeacherDistributionEntity,
          'distribution',
          'distribution.subjectId = subject.id AND distribution.deletedAt IS NULL',
        )

        .leftJoin(
          EnrollmentDetailEntity,
          'detail',
          `
          detail.subject_id = subject.id
          AND detail.parallel_id = distribution.parallel_id
          AND detail.workday_id = distribution.workday_id
          AND detail.deleted_at IS NULL
        `,
        )

        .leftJoin(
          EnrollmentEntity,
          'enrollment',
          `
  enrollment.id = detail.enrollment_id
  AND enrollment.school_period_id = :schoolPeriodId
  AND enrollment.deleted_at IS NULL
`,
          { schoolPeriodId },
        )

        // Último estado del detalle
        .leftJoin(
          (qb) => this.getLastEnrollmentDetailStateQuery(qb),
          'last_state',
          'last_state.enrollment_detail_id = detail.id',
        )

        .leftJoin(CatalogueEntity, 'state', 'state.id = last_state.state_id')

        .where('subject.careerId = :careerId', { careerId })
        .andWhere('subject.academicPeriodId = :academicPeriodId', { academicPeriodId })
        .andWhere('subject.isEnabled = true')
        .andWhere('distribution.schoolPeriodId = :schoolPeriodId', { schoolPeriodId })
        .andWhere('distribution.workdayId = :workdayId', { workdayId })
        .andWhere('distribution.parallelId = :parallelId', { parallelId })

        .select([
          'subject.id AS id',
          'subject.code AS code',
          'subject.name AS name',
          'subject.credits AS credits',
        ])

        .addSelect('distribution.capacity', 'capacity')

        .addSelect(occupiedCount, 'occupied')

        .groupBy('subject.id')
        .addGroupBy('subject.code')
        .addGroupBy('subject.name')
        .addGroupBy('subject.credits')
        .addGroupBy('distribution.capacity')

        .having(`${occupiedCount} < distribution.capacity`);

      const subjects = await query.getRawMany();

      return {
        data: subjects,
        message: 'Materias obtenidas exitosamente',
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
