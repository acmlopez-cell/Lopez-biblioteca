import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { PublicRoute } from '@auth/decorators';
import { SchoolPeriodsService } from '../services/school-periods.service';

@ApiTags('School Periods')
@Controller('core/student/school-periods')
export class SchoolPeriodsController {
  constructor(private readonly schoolPeriodsService: SchoolPeriodsService) {}

  @Get('catalogue')
  @PublicRoute()
  @ApiOperation({ summary: 'Obtiene el catálogo de períodos escolares' })
  catalogue() {
    return this.schoolPeriodsService.catalogue();
  }

  @Get('open')
  @PublicRoute()
  @ApiOperation({ summary: 'Obtiene el período escolar abierto' })
  async findOpenSchoolPeriod() {
    const data = await this.schoolPeriodsService.findOpenSchoolPeriod();

    return {
      data: {
        id: data.id,
        code: data.code,
        name: data.name,
        shortName: data.shortName,
        startedAt: data.startedAt,
        endedAt: data.endedAt,
      },
      message: 'Período escolar obtenido correctamente',
    };
  }
}
