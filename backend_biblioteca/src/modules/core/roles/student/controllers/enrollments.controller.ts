import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Auth, PublicRoute, Roles, User } from '@auth/decorators';
import { UserEntity } from '@auth/entities';
import { EnrollmentsService } from '../services/enrollments.service';
import { ResponseHttpInterface } from '@utils/interfaces';
import { UpdateEnrollmentDto } from '../dto/enrollments/update-enrollment.dto';
import { RoleEnum } from '@auth/enums';
import { GetAvailableSubjectsDto } from '../dto/enrollments/get-available-subjects.dto';
@ApiTags('Enrollments')
@Auth()
@Controller('core/student/enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @ApiOperation({ summary: 'Send Registration' })
  @Roles(RoleEnum.student)
  @Post('send-registration')
  @HttpCode(HttpStatus.CREATED)
  async sendRegistration(
    @User() user: UserEntity,
    @Body() payload: any, //estaba any
  ): Promise<ResponseHttpInterface> {
    console.dir(payload, { depth: null });

    const serviceResponse = await this.enrollmentsService.sendRegistration(user.id, payload);

    return {
      data: serviceResponse,
      message: 'Asignaturas Registradas',
      title: 'Registro',
    };
  }

  @ApiOperation({ summary: 'Send Request' })
  @Post(':id/send-request')
  @Roles(RoleEnum.student)
  @HttpCode(HttpStatus.CREATED)
  async sendRequest(
    @User() user: UserEntity,
    @Param('id') id: string,
    @Body() payload: UpdateEnrollmentDto,
  ): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.enrollmentsService.sendRequest(user.id, id, payload);

    return {
      data: serviceResponse,
      message: 'Solicitud Enviada',
      title: 'Solicitud Enviada',
    };
  }
  @Get('available-subjects')
  @PublicRoute()
  @ApiOperation({
    summary: 'Obtiene las materias disponibles cruzando Subject y TeacherDistribution',
  })
  async getAvailableSubjects(@Query() queryDto: GetAvailableSubjectsDto) {
    return this.enrollmentsService.getAvailableSubjects(queryDto);
  }
}
