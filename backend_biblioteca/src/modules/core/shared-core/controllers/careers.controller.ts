import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth } from '@auth/decorators';
import { ResponseHttpInterface } from '@utils/interfaces';
import { FilterCareerDto } from '@modules/core/shared-core/dto';
import { CareersService } from '@modules/core/shared-core/services/careers.service';

@ApiTags('Careers')
@Auth()
@Controller('core/shared/careers')
export class CareersController {
  constructor(private readonly service: CareersService) {}

  @ApiOperation({ summary: 'Find All Careers' })
  @Get('review')
  // @Roles(RoleEnum.career_coordinator)
  async findAll(@Query() params: FilterCareerDto): Promise<ResponseHttpInterface> {
    const response = await this.service.findAll(params);

    return {
      data: response.data,
      pagination: response.pagination,
      message: `Carreras`,
      title: `Consultado`,
    };
  }

  @ApiOperation({ summary: 'Find All Careers' })
  @Get()
  // @Roles(RoleEnum.career_coordinator)
  async loadCareers(): Promise<ResponseHttpInterface> {
    const response = await this.service.loadCareers();

    return {
      data: response,
      message: `Carreras`,
      title: `Consultado`,
    };
  }

  @ApiOperation({ summary: 'Find All Careers' })
  @Get('institutions')
  // @Roles(RoleEnum.career_coordinator)
  async loadInstitutions(): Promise<ResponseHttpInterface> {
    const response = await this.service.findInstitutions();

    return {
      data: response,
      message: `Institutions`,
      title: `Consultado`,
    };
  }

  @ApiOperation({ summary: 'Find All Careers' })
  @Get('school-periods')
  // @Roles(RoleEnum.career_coordinator)
  async loadSchoolPeriods(): Promise<ResponseHttpInterface> {
    const response = await this.service.findSchoolPeriods();

    return {
      data: response,
      message: `Institutions`,
      title: `Consultado`,
    };
  }

  @ApiOperation({ summary: 'Find One Career' })
  @Get(':id')
  // @Roles(RoleEnum.career_coordinator)
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpInterface> {
    const response = await this.service.findOne(id);

    return {
      data: response,
      message: `Carrera`,
      title: `Consultado`,
    };
  }
}
