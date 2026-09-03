import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { StudentsService } from '../services/students.service';
import { ResponseHttpInterface } from '@utils/interfaces';
import { UpdateStudentDto } from '../dto/students/update-student.dto';
import { Auth, PublicRoute, Roles, User } from '@auth/decorators';
import { RoleEnum } from '@auth/enums';
import { EnrollmentsService } from '../services/enrollments.service';
import { UserEntity } from '@auth/entities';
import {
  EnrollmentEntity,
  OriginAddressEntity,
  ResidenceAddressEntity,
} from '@modules/core/entities';
import { LocationsService } from '../services/locations.service';

@ApiTags('Students')
@Auth()
@Controller('core/student/students')
export class StudentsController {
  constructor(
    private studentService: StudentsService,
    private enrollmentsService: EnrollmentsService,
    private locationService: LocationsService,
  ) {}

  @ApiOperation({ summary: 'Obtener estado actual de matrícula para el formulario' })
  @Roles(RoleEnum.student)
  @Get('current-draft')
  async getCurrentDraft(@User() user: UserEntity): Promise<ResponseHttpInterface> {
    try {
      const studentInfo = await this.studentService.getProfile(user.id);

      let originAddress: OriginAddressEntity | null = null;
      try {
        originAddress = await this.locationService.findOriginByUserId(user.id);
      } catch (error) {
        console.warn('Dirección de origen no encontrada o error en consulta:', error.message);
      }

      let residenceAddress: ResidenceAddressEntity | null = null;
      try {
        residenceAddress = await this.locationService.findResidenceByUserId(user.id);
      } catch (error) {
        console.warn('Dirección de residencia no encontrada o error en consulta:', error.message);
      }

      let enrollment: EnrollmentEntity | null = null;
      if (studentInfo) {
        try {
          enrollment = await this.enrollmentsService.findEnrollmentByStudent(studentInfo.id);
        } catch (error) {
          console.error('Error exacto al buscar enrollment:', error.message);
        }
      }

      return {
        data: {
          studentInfo,
          location: {
            origin: originAddress,
            residence: residenceAddress,
          },
          enrollment,
        },
        message: 'Datos recuperados',
        title: 'Borrador',
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al recuperar los datos principales del borrador',
      );
    }
  }

  @Patch(':id/personal-information')
  @Roles(RoleEnum.student)
  @HttpCode(HttpStatus.CREATED)
  async updatePersonalInformation(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: UpdateStudentDto,
  ): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.studentService.updatePersonalInformation(id, payload);

    return {
      data: serviceResponse,
      message: `Datos Personales Actualizados`,
      title: `Actualizado`,
    };
  }

  @Patch(':id/origin-place')
  @PublicRoute()
  @HttpCode(HttpStatus.CREATED)
  async updateOriginPlace(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: UpdateStudentDto,
  ): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.studentService.updateOriginPlace(id, payload);

    return {
      data: serviceResponse,
      message: `Lugar de Procedencia Actualizado`,
      title: `Actualizado`,
    };
  }

  @Patch(':id/residence-place')
  @PublicRoute()
  @HttpCode(HttpStatus.CREATED)
  async updateResidencePlace(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: UpdateStudentDto,
  ): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.studentService.updateResidencePlace(id, payload);

    return {
      data: serviceResponse,
      message: `Lugar de Residencia Actualizado`,
      title: `Actualizado`,
    };
  }

  @Get('/:id/enrollment-details')
  @HttpCode(HttpStatus.OK)
  async findEnrollmentsDetailsByStudent(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.enrollmentsService.findEnrollmentsByStudent(id);

    return {
      data: serviceResponse,
      message: `Success`,
      title: `GET`,
    };
  }
}
