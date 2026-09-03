import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm'; //FindOptionsWhere,
import { InformationStudentsService } from './information-students.service';
import { OriginAddressesService } from './origin-addresses.service';
import { ResidenceAddressesService } from './residence-addresses.service';
import { UpdateUserDto } from '@auth/dto';
import { UserEntity } from '@auth/entities';
import { StudentEntity } from '@modules/core/entities';
import { CoreRepositoryEnum } from '@modules/core/shared-core/enums';
import { AuthRepositoryEnum } from '@utils/enums';
import { UpdateStudentDto } from '../dto/students/update-student.dto';

@Injectable()
export class StudentsService {
  constructor(
    @Inject(CoreRepositoryEnum.studentRepository)
    private readonly repository: Repository<StudentEntity>,
    @Inject(AuthRepositoryEnum.userRepository)
    private readonly userRepository: Repository<UserEntity>,
    private readonly informationStudentsService: InformationStudentsService,
    private readonly originAddressesService: OriginAddressesService,
    private readonly residenceAddressesService: ResidenceAddressesService,
  ) {}

  async updatePersonalInformation(id: string, payload: UpdateStudentDto): Promise<StudentEntity> {
    const student = await this.repository.findOne({
      relations: { informationStudent: true, user: true },
      where: { id },
    });

    if (!student) {
      throw new NotFoundException('Estudiante no encontrado');
    }
    if (payload.user) {
      Object.assign(student.user, {
        identificationTypeId: payload.user.identificationType?.id,
        identification: payload.user.identification,
        name: payload.user.name,
        lastname: payload.user.lastname,
        birthdate: payload.user.birthdate,
        maritalStatusId: payload.user.maritalStatus?.id,
        nationalityId: payload.user.nationality?.id,
        genderId: payload.user.gender?.id,
        sexId: payload.user.sex?.id,
        ethnicOriginId: payload.user.ethnicOrigin?.id,
        cellPhone: payload.user.cellPhone,
        phone: payload.user.phone,
        personalEmail: payload.user.personalEmail,
        email: payload.user.email,
      });

      await this.updateUser(student.userId, student.user);
    }
    if (payload.informationStudent) {
      const info = payload.informationStudent;

      Object.assign(student.informationStudent, {
        // Relaciones y campos base
        careerId: info.career?.id || null,
        academicPeriodId: info.academicPeriod?.id || null,
        address: info.address || null,

        contactEmergencyName: info.contactEmergencyName,
        contactEmergencyPhone: info.contactEmergencyPhone,
        contactEmergencyKinshipId: info.contactEmergencyKinship?.id || null,

        // Trabajo (con limpieza condicional si isWork es false)
        isWork: info.isWork,
        workAddress: info.isWork ? info.workAddress : null,
        monthlySalaryId: info.isWork ? info.monthlySalary?.id : null,
        workingHoursId: info.isWork ? info.workingHours?.id : null,
        workPosition: info.isWork ? info.workPosition : null,

        // Estado Social
        isHouseHead: info.isHouseHead,
        isSocialSecurity: info.isSocialSecurity,
        isPrivateSecurity: info.isPrivateSecurity,

        // Hijos
        isHasChildren: info.isHasChildren,
        childrenTotal: info.isHasChildren ? info.childrenTotal : null,

        // Discapacidad
        isDisability: info.isDisability,
        disabilityTypeId: info.isDisability ? info.disabilityType?.id || null : null,
        disabilityPercentage: info.isDisability ? info.disabilityPercentage : null,

        // Lenguajes
        isAncestralLanguage: info.isAncestralLanguage,
        ancestralLanguageNameId: info.isAncestralLanguage
          ? info.ancestralLanguageName?.id || null
          : null,

        isForeignLanguage: info.isForeignLanguage,
        foreignLanguageNameId: info.isForeignLanguage ? info.foreignLanguageName?.id || null : null,

        // Enfermedad Catastrófica
        isCatastrophicIllness: info.isCatastrophicIllness,
        catastrophicIllness: info.isCatastrophicIllness ? info.catastrophicIllness : null,

        indigenousNationalityId: info.indigenousNationality ? info.indigenousNationality.id : null,
        townId: info.town.id,
      });

      await this.informationStudentsService.update(
        student.informationStudent.id,
        student.informationStudent,
      );
    }
    return student;
  }

  async updateOriginPlace(id: string, payload: UpdateStudentDto): Promise<StudentEntity> {
    const student = await this.repository.findOne({
      relations: { user: { originAddress: true } },
      where: { id },
    });

    if (!student) {
      throw new NotFoundException('Estudiante no encontrado');
    }
    if (!payload || !payload.user) {
      throw new NotFoundException('Datos no ingresados');
    }

    if (!student.user.originAddress) {
      await this.originAddressesService.create({
        cantonId: payload.user.originAddress.canton?.id,
        countryId: payload.user.originAddress.country?.id,
        community: payload.user.originAddress.community,
        latitude: payload.user.originAddress.latitude,
        longitude: payload.user.originAddress.longitude,
        mainStreet: payload.user.originAddress.mainStreet,
        modelId: student.user.id,
        number: payload.user.originAddress.number,
        parishId: payload.user.originAddress.parish?.id,
        postCode: payload.user.originAddress.postCode,
        provinceId: payload.user.originAddress.province?.id,
        reference: payload.user.originAddress.reference,
        secondaryStreet: payload.user.originAddress.secondaryStreet,
      });
    } else {
      await this.originAddressesService.update(student.user.originAddress.id, {
        cantonId: payload.user.originAddress.canton?.id,
        community: payload.user.originAddress.community,
        latitude: payload.user.originAddress.latitude,
        longitude: payload.user.originAddress.longitude,
        mainStreet: payload.user.originAddress.mainStreet,
        number: payload.user.originAddress.number,
        parishId: payload.user.originAddress.parish?.id,
        postCode: payload.user.originAddress.postCode,
        provinceId: payload.user.originAddress.province?.id,
        reference: payload.user.originAddress.reference,
        secondaryStreet: payload.user.originAddress.secondaryStreet,
      });
    }

    return student;
  }

  async updateResidencePlace(id: string, payload: UpdateStudentDto): Promise<StudentEntity> {
    const student = await this.repository.findOne({
      relations: { user: { residenceAddress: true } },
      where: { id },
    });

    if (!student) {
      throw new NotFoundException('Estudiante no encontrado');
    }
    if (!payload || !payload.user) {
      throw new NotFoundException('Datos no ingresados');
    }

    if (!student.user.residenceAddress) {
      await this.residenceAddressesService.create({
        cantonId: payload.user.residenceAddress.canton?.id,
        countryId: payload.user.residenceAddress.country?.id,
        latitude: payload.user.residenceAddress.latitude,
        longitude: payload.user.residenceAddress.longitude,
        mainStreet: payload.user.residenceAddress.mainStreet,
        modelId: student.user.id,
        nearbyCity: payload.user.residenceAddress.nearbyCity,
        number: payload.user.residenceAddress.number,
        parishId: payload.user.residenceAddress.parish?.id,
        postCode: payload.user.residenceAddress.postCode,
        provinceId: payload.user.residenceAddress.province?.id,
        reference: payload.user.residenceAddress.reference,
        secondaryStreet: payload.user.residenceAddress.secondaryStreet,
      });
    } else {
      await this.residenceAddressesService.update(student.user.residenceAddress.id, {
        cantonId: payload.user.residenceAddress.canton?.id,
        latitude: payload.user.residenceAddress.latitude,
        longitude: payload.user.residenceAddress.longitude,
        mainStreet: payload.user.residenceAddress.mainStreet,
        nearbyCity: payload.user.residenceAddress.nearbyCity,
        number: payload.user.residenceAddress.number,
        parishId: payload.user.residenceAddress.parish?.id,
        postCode: payload.user.residenceAddress.postCode,
        provinceId: payload.user.residenceAddress.province?.id,
        reference: payload.user.residenceAddress.reference,
        secondaryStreet: payload.user.residenceAddress.secondaryStreet,
      });
    }

    return student;
  }

  private async updateUser(id: string, payload: UpdateUserDto): Promise<UserEntity> {
    const user = await this.userRepository.preload({ id, ...payload });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado para actualizar');
    }

    this.userRepository.merge(user, payload);

    return await this.userRepository.save(user);
  }
  async getProfile(userId: string): Promise<StudentEntity> {
    const student = await this.repository.findOne({
      // Buscamos por el userId que es la llave foránea en StudentEntity
      where: { userId },
      relations: {
        // 1. Cargamos el usuario y sus catálogos (Asegúrate de que UserEntity tenga estas relaciones)
        user: {
          identificationType: true,
          gender: true,
          ethnicOrigin: true,
          maritalStatus: true,
          nationality: true,
          sex: true,
        },
        // 2. Cargamos la información del estudiante y todos sus catálogos definidos en tu entidad
        informationStudent: {
          career: true,
          academicPeriod: true,
          contactEmergencyKinship: true,
          disabilityType: true,
          ancestralLanguageName: true,
          foreignLanguageName: true,
          indigenousNationality: true,
          monthlySalary: true,
          town: true,
          workingHours: true,
        },
      },
    });

    if (!student) {
      throw new NotFoundException('Perfil de estudiante no encontrado');
    }

    return student;
  }
}
