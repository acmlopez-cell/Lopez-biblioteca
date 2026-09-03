import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { PublicRoute } from '@auth/decorators';
import { TeacherDistributionService } from '../services/teacher-distribution.service';

@ApiTags('Teacher Distribution')
@Controller('core/student/teacher-distribution')
export class TeacherDistributioNController {
  constructor(private readonly teacherDistributionService: TeacherDistributionService) {}

  @Get('/:schoolPeriodId')
  @ApiOperation({ summary: 'Obtiene lod datos de teacher distribution con relaciones' })
  async findTeacherDisteibution(@Param('schoolPeriodId') schoolPeriodId: string) {
    const teacherDistribution =
      await this.teacherDistributionService.findBySchoolPeriod(schoolPeriodId);
    return {
      data: teacherDistribution,
      message: 'datos obtenidos teacher distribution',
    };
  }
}
