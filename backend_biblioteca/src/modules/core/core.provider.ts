import { CoreRepositoryEnum } from '@modules/core/shared-core/enums';
import { DataSource } from 'typeorm';
import {
  CareerEntity,
  EnrollmentDetailEntity,
  EnrollmentDetailStateEntity,
  EnrollmentEntity,
  EnrollmentStateEntity,
  InformationStudentEntity,
  InstitutionEntity,
  OriginAddressEntity,
  ResidenceAddressEntity,
  SchoolPeriodEntity,
  StudentEntity,
  SubjectEntity,
  TeacherDistributionEntity,
} from '@modules/core/entities';
import { ConfigEnum } from '@utils/enums';

export const coreProviders = [
  {
    provide: CoreRepositoryEnum.studentRepository,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(StudentEntity),
    inject: [ConfigEnum.PG_DATA_SOURCE],
  },
  {
    provide: CoreRepositoryEnum.careerRepository,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(CareerEntity),
    inject: [ConfigEnum.PG_DATA_SOURCE],
  },
  {
    provide: CoreRepositoryEnum.originAddressRepository,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(OriginAddressEntity),
    inject: [ConfigEnum.PG_DATA_SOURCE],
  },
  {
    provide: CoreRepositoryEnum.residenceAddressRepository,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(ResidenceAddressEntity),
    inject: [ConfigEnum.PG_DATA_SOURCE],
  },
  {
    provide: CoreRepositoryEnum.enrollmentRepository,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(EnrollmentEntity),
    inject: [ConfigEnum.PG_DATA_SOURCE],
  },
  {
    provide: CoreRepositoryEnum.informationStudenRepository,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(InformationStudentEntity),
    inject: [ConfigEnum.PG_DATA_SOURCE],
  },
  {
    provide: CoreRepositoryEnum.enrollmentDetailRespository,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(EnrollmentDetailEntity),
    inject: [ConfigEnum.PG_DATA_SOURCE],
  },
  {
    provide: CoreRepositoryEnum.enrollmentStateRepository,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(EnrollmentStateEntity),
    inject: [ConfigEnum.PG_DATA_SOURCE],
  },
  {
    provide: CoreRepositoryEnum.enrollmentDetailStateRepository,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(EnrollmentDetailStateEntity),
    inject: [ConfigEnum.PG_DATA_SOURCE],
  },
  {
    provide: CoreRepositoryEnum.schoolPeriodRepository,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(SchoolPeriodEntity),
    inject: [ConfigEnum.PG_DATA_SOURCE],
  },
  {
    provide: CoreRepositoryEnum.teacherDistributionRepository,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(TeacherDistributionEntity),
    inject: [ConfigEnum.PG_DATA_SOURCE],
  },
  {
    provide: CoreRepositoryEnum.subjectRepository,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(SubjectEntity),
    inject: [ConfigEnum.PG_DATA_SOURCE],
  },
  {
    provide: CoreRepositoryEnum.institutionRepository,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(InstitutionEntity),
    inject: [ConfigEnum.PG_DATA_SOURCE],
  },
];
