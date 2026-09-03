import { Global, Module } from '@nestjs/common';
import { CatalogueModule } from '@modules/common/catalogue/catalogue.module';
import { FileModule } from '@modules/common/file/file.module';
import { MailModule } from '@modules/common/mail/mail.module';
import { coreProviders } from '@modules/core/core.provider';
import { SharedCoreModule } from '@modules/core/shared-core/shared-core.module';
import { ReportsModule } from '@modules/reports/reports.module';
import { controllers } from '@modules/core/roles/student/controllers';
import { StudentsService } from './services/students.service';
import { OriginAddressesService } from './services/origin-addresses.service';
import { ResidenceAddressesService } from './services/residence-addresses.service';
import { EnrollmentsService } from './services/enrollments.service';
import { EnrollmentReportsService } from './services/enrollment-reports.service';
import { InformationStudentsService } from './services/information-students.service';
import { EnrollmentDetailStatesService } from './services/enrollment-detail-states.service';
import { EnrollmentDetailsService } from './services/enrollment-details.service';
import { EnrollmentStatesService } from './services/enrollment-states.service';
import { EnrollmentSqlService } from './services/enrollment-sql.service';
import { SchoolPeriodsService } from './services/school-periods.service';
import { LocationsService } from './services/locations.service';
import { CacheModule } from '@nestjs/cache-manager';
import { TeacherDistributionService } from './services/teacher-distribution.service';

@Global()
@Module({
  imports: [
    CatalogueModule,
    FileModule,
    MailModule,
    SharedCoreModule,
    ReportsModule,
    CacheModule.register(),
  ],
  controllers,
  providers: [
    ...coreProviders,
    StudentsService,
    OriginAddressesService,
    ResidenceAddressesService,
    EnrollmentsService,
    EnrollmentReportsService,
    InformationStudentsService,
    EnrollmentStatesService,
    EnrollmentDetailsService,
    EnrollmentDetailStatesService,
    EnrollmentSqlService,
    SchoolPeriodsService,
    LocationsService,
    TeacherDistributionService,
  ],
  exports: [],
})
export class StudentModule {}
