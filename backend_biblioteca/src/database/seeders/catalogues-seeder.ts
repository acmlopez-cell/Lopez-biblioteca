import { Injectable } from '@nestjs/common';
import { CreateCatalogueDto } from '@modules/common/catalogue/dto';
import { CataloguesService } from '@modules/common/catalogue/catalogue.service';
import {
  CatalogueEthnicOriginEnum,
  CatalogueMaritalStatusEnum,
  CatalogueStateEnum,
  CatalogueTypeEnum,
} from '@utils/enums';

@Injectable()
export class CataloguesSeeder {
  constructor(private catalogueService: CataloguesService) {}

  async run() {
    await this.createBloodTypeCatalogues();
    await this.createEthnicOriginCatalogues();
    await this.createIdentificationTypeCatalogues();
    await this.createSexCatalogues();
    await this.createGenderCatalogues();
    await this.createMaritalStatusCatalogues();
    await this.createNationalityCatalogues();
    await this.createSecurityQuestionCatalogues();
  }

  private async createBloodTypeCatalogues(): Promise<void> {
    const catalogues: CreateCatalogueDto[] = [];

    catalogues.push(
      {
        code: 'a+',
        description: 'tipo de sangre',
        name: 'A+',
        sort: 1,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.usersBloodType,
      },
      {
        code: 'a-',
        description: 'tipo de sangre',
        name: 'A-',
        sort: 2,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.usersBloodType,
      },
      {
        code: 'b+',
        description: 'tipo de sangre',
        name: 'B+',
        sort: 3,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.usersBloodType,
      },
      {
        code: 'b-',
        description: 'tipo de sangre',
        name: 'B-',
        sort: 4,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.usersBloodType,
      },
      {
        code: 'ab+',
        description: 'tipo de sangre',
        name: 'AB+',
        sort: 5,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.usersBloodType,
      },
      {
        code: 'ab-',
        description: 'tipo de sangre',
        name: 'AB-',
        sort: 6,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.usersBloodType,
      },
      {
        code: 'o+',
        description: 'tipo de sangre',
        name: 'O+',
        sort: 7,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.usersBloodType,
      },
      {
        code: 'o-',
        description: 'tipo de sangre',
        name: 'O-',
        sort: 8,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.usersBloodType,
      },
    );

    for (const catalogue of catalogues) {
      await this.catalogueService.create(catalogue);
    }
  }

  private async createEthnicOriginCatalogues() {
    const catalogues: CreateCatalogueDto[] = [];
    catalogues.push(
      {
        code: CatalogueEthnicOriginEnum.indigenous,
        description: 'etnia',
        name: 'Indígena',
        sort: 1,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.usersEthnicOrigin,
      },
      {
        code: CatalogueEthnicOriginEnum.afro_ecuadorian,
        description: 'etnia',
        name: 'Afroecuatoriano',
        sort: 1,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.usersEthnicOrigin,
      },
      {
        code: CatalogueEthnicOriginEnum.montubio,
        description: 'etnia',
        name: 'Montubio',
        sort: 1,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.usersEthnicOrigin,
      },
      {
        code: CatalogueEthnicOriginEnum.half_blood,
        description: 'etnia',
        name: 'Mestizo',
        sort: 1,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.usersEthnicOrigin,
      },
      {
        code: CatalogueEthnicOriginEnum.white,
        description: 'etnia',
        name: 'Blanco',
        sort: 1,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.usersEthnicOrigin,
      },
    );

    for (const catalogue of catalogues) {
      await this.catalogueService.create(catalogue);
    }
  }

  private async createIdentificationTypeCatalogues() {
    const catalogues: CreateCatalogueDto[] = [];
    catalogues.push(
      {
        code: '1',
        description: 'tipo de identificacion',
        name: 'Cédula',
        sort: 1,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.usersIdentificationType,
      },
      {
        code: '2',
        description: 'tipo de identificacion',
        name: 'Pasaporte',
        sort: 1,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.usersIdentificationType,
      },
    );

    for (const catalogue of catalogues) {
      await this.catalogueService.create(catalogue);
    }
  }

  private async createGenderCatalogues() {
    const catalogues: CreateCatalogueDto[] = [];
    catalogues.push(
      {
        code: 'male',
        description: 'genero',
        name: 'Masculino',
        sort: 1,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.usersGender,
      },
      {
        code: 'female',
        description: 'tipo de identificacion',
        name: 'Femenino',
        sort: 2,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.usersGender,
      },
      {
        code: 'other',
        description: '',
        name: 'Otro',
        sort: 3,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.usersGender,
      },
    );

    for (const catalogue of catalogues) {
      await this.catalogueService.create(catalogue);
    }
  }

  private async createMaritalStatusCatalogues() {
    const catalogues: CreateCatalogueDto[] = [];
    catalogues.push(
      {
        code: CatalogueMaritalStatusEnum.single,
        description: 'estado civil',
        name: 'Soltero/a',
        sort: 1,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.usersMaritalStatus,
      },
      {
        code: CatalogueMaritalStatusEnum.married,
        description: 'estado civil',
        name: 'Casado/a',
        sort: 2,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.usersMaritalStatus,
      },
      {
        code: CatalogueMaritalStatusEnum.divorced,
        description: 'estado civil',
        name: 'Divorciado/a',
        sort: 3,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.usersMaritalStatus,
      },
      {
        code: CatalogueMaritalStatusEnum.free_union,
        description: 'estado civil',
        name: 'Unión libre',
        sort: 4,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.usersMaritalStatus,
      },
      {
        code: CatalogueMaritalStatusEnum.widower,
        description: 'estado civil',
        name: 'Viudo/a',
        sort: 5,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.usersMaritalStatus,
      },
    );

    for (const catalogue of catalogues) {
      await this.catalogueService.create(catalogue);
    }
  }

  private async createSexCatalogues() {
    const catalogues: CreateCatalogueDto[] = [];
    catalogues.push(
      {
        code: '1',
        description: 'sexo',
        name: 'Hombre',
        sort: 1,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.usersSex,
      },
      {
        code: '2',
        description: 'sexo',
        name: 'Mujer',
        sort: 1,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.usersSex,
      },
    );

    for (const catalogue of catalogues) {
      await this.catalogueService.create(catalogue);
    }
  }

  private async createNationalityCatalogues() {
    const catalogues: CreateCatalogueDto[] = [];

    catalogues.push(
      {
        code: 'af',
        description: 'Nacionalidad',
        name: 'Afgana',
        sort: 1,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.usersNationality,
      },
      {
        code: 'al',
        description: 'Nacionalidad',
        name: 'Albanesa',
        sort: 2,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.usersNationality,
      },
      {
        code: 'dz',
        description: 'Nacionalidad',
        name: 'Argelina',
        sort: 3,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.usersNationality,
      },
      {
        code: 'ad',
        description: 'Nacionalidad',
        name: 'Andorrana',
        sort: 4,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.usersNationality,
      },
      {
        code: 'ao',
        description: 'Nacionalidad',
        name: 'Angoleña',
        sort: 5,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.usersNationality,
      },
      {
        code: 'ar',
        description: 'Nacionalidad',
        name: 'Argentina',
        sort: 6,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.usersNationality,
      },
      {
        code: 'am',
        description: 'Nacionalidad',
        name: 'Armenia',
        sort: 7,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.usersNationality,
      },
      {
        code: 'au',
        description: 'Nacionalidad',
        name: 'Australiana',
        sort: 8,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.usersNationality,
      },
      {
        code: 'at',
        description: 'Nacionalidad',
        name: 'Austriaca',
        sort: 9,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.usersNationality,
      },
      {
        code: 'az',
        description: 'Nacionalidad',
        name: 'Azerbaiyana',
        sort: 10,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.usersNationality,
      },

      {
        code: 'bd',
        description: 'Nacionalidad',
        name: 'Bangladesí',
        sort: 11,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.usersNationality,
      },
      {
        code: 'be',
        description: 'Nacionalidad',
        name: 'Belga',
        sort: 12,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.usersNationality,
      },
      {
        code: 'bo',
        description: 'Nacionalidad',
        name: 'Boliviana',
        sort: 13,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.usersNationality,
      },
      {
        code: 'br',
        description: 'Nacionalidad',
        name: 'Brasileña',
        sort: 14,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.usersNationality,
      },
      {
        code: 'bg',
        description: 'Nacionalidad',
        name: 'Búlgara',
        sort: 15,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.usersNationality,
      },

      {
        code: 'ca',
        description: 'Nacionalidad',
        name: 'Canadiense',
        sort: 16,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.usersNationality,
      },
      {
        code: 'cl',
        description: 'Nacionalidad',
        name: 'Chilena',
        sort: 17,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.usersNationality,
      },
      {
        code: 'cn',
        description: 'Nacionalidad',
        name: 'China',
        sort: 18,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.usersNationality,
      },
      {
        code: 'co',
        description: 'Nacionalidad',
        name: 'Colombiana',
        sort: 19,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.usersNationality,
      },
      {
        code: 'cr',
        description: 'Nacionalidad',
        name: 'Costarricense',
        sort: 20,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.usersNationality,
      },

      {
        code: 'cu',
        description: 'Nacionalidad',
        name: 'Cubana',
        sort: 21,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.usersNationality,
      },
      {
        code: 'dk',
        description: 'Nacionalidad',
        name: 'Danesa',
        sort: 22,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.usersNationality,
      },
      {
        code: 'do',
        description: 'Nacionalidad',
        name: 'Dominicana',
        sort: 23,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.usersNationality,
      },
      {
        code: 'ec',
        description: 'Nacionalidad',
        name: 'Ecuatoriana',
        sort: 24,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.usersNationality,
      },
      {
        code: 'eg',
        description: 'Nacionalidad',
        name: 'Egipcia',
        sort: 25,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.usersNationality,
      },

      {
        code: 'sv',
        description: 'Nacionalidad',
        name: 'Salvadoreña',
        sort: 26,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.usersNationality,
      },
      {
        code: 'es',
        description: 'Nacionalidad',
        name: 'Española',
        sort: 27,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.usersNationality,
      },
      {
        code: 'us',
        description: 'Nacionalidad',
        name: 'Estadounidense',
        sort: 28,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.usersNationality,
      },
      {
        code: 'fr',
        description: 'Nacionalidad',
        name: 'Francesa',
        sort: 29,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.usersNationality,
      },
      {
        code: 'de',
        description: 'Nacionalidad',
        name: 'Alemana',
        sort: 30,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.usersNationality,
      },

      {
        code: 'gt',
        description: 'Nacionalidad',
        name: 'Guatemalteca',
        sort: 31,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.usersNationality,
      },
      {
        code: 'hn',
        description: 'Nacionalidad',
        name: 'Hondureña',
        sort: 32,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.usersNationality,
      },
      {
        code: 'in',
        description: 'Nacionalidad',
        name: 'India',
        sort: 33,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.usersNationality,
      },
      {
        code: 'id',
        description: 'Nacionalidad',
        name: 'Indonesia',
        sort: 34,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.usersNationality,
      },
      {
        code: 'it',
        description: 'Nacionalidad',
        name: 'Italiana',
        sort: 35,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.usersNationality,
      },

      {
        code: 'jp',
        description: 'Nacionalidad',
        name: 'Japonesa',
        sort: 36,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.usersNationality,
      },
      {
        code: 'mx',
        description: 'Nacionalidad',
        name: 'Mexicana',
        sort: 37,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.usersNationality,
      },
      {
        code: 'ni',
        description: 'Nacionalidad',
        name: 'Nicaragüense',
        sort: 38,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.usersNationality,
      },
      {
        code: 'no',
        description: 'Nacionalidad',
        name: 'Noruega',
        sort: 39,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.usersNationality,
      },
      {
        code: 'pa',
        description: 'Nacionalidad',
        name: 'Panameña',
        sort: 40,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.usersNationality,
      },

      {
        code: 'py',
        description: 'Nacionalidad',
        name: 'Paraguaya',
        sort: 41,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.usersNationality,
      },
      {
        code: 'pe',
        description: 'Nacionalidad',
        name: 'Peruana',
        sort: 42,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.usersNationality,
      },
      {
        code: 'pt',
        description: 'Nacionalidad',
        name: 'Portuguesa',
        sort: 43,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.usersNationality,
      },
      {
        code: 'gb',
        description: 'Nacionalidad',
        name: 'Británica',
        sort: 44,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.usersNationality,
      },
      {
        code: 'ru',
        description: 'Nacionalidad',
        name: 'Rusa',
        sort: 45,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.usersNationality,
      },

      {
        code: 'se',
        description: 'Nacionalidad',
        name: 'Sueca',
        sort: 46,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.usersNationality,
      },
      {
        code: 'ch',
        description: 'Nacionalidad',
        name: 'Suiza',
        sort: 47,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.usersNationality,
      },
      {
        code: 'tr',
        description: 'Nacionalidad',
        name: 'Turca',
        sort: 48,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.usersNationality,
      },
      {
        code: 'ua',
        description: 'Nacionalidad',
        name: 'Ucraniana',
        sort: 49,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.usersNationality,
      },
      {
        code: 'uy',
        description: 'Nacionalidad',
        name: 'Uruguaya',
        sort: 50,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.usersNationality,
      },

      {
        code: 've',
        description: 'Nacionalidad',
        name: 'Venezolana',
        sort: 51,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.usersNationality,
      },
    );

    for (const catalogue of catalogues) {
      await this.catalogueService.create(catalogue);
    }
  }

  private async createSecurityQuestionCatalogues() {
    const catalogues: CreateCatalogueDto[] = [];

    catalogues.push(
      {
        code: '1',
        description: '',
        name: '¿Cuál es el primer nombre de tu padre?',
        sort: 1,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.usersSecurityQuestion,
      },
      {
        code: '2',
        description: '',
        name: '¿Cómo se llamaba tu mascota favorita?',
        sort: 2,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.usersSecurityQuestion,
      },
      {
        code: '3',
        description: '',
        name: '¿Cuál es el segundo nombre de tu padre?',
        sort: 3,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.usersSecurityQuestion,
      },
      {
        code: '4',
        description: '',
        name: '¿Cuál fue el nombre de tu mejor amigo o amiga de la infancia?',
        sort: 4,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.usersSecurityQuestion,
      },
      {
        code: '5',
        description: '',
        name: '¿Cuál era el nombre de tu escuela primaria?',
        sort: 5,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.usersSecurityQuestion,
      },
      {
        code: '6',
        description: '',
        name: '¿Cuál es el nombre de tu primo o prima favorita?',
        sort: 6,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.usersSecurityQuestion,
      },
      {
        code: '7',
        description: '',
        name: '¿Cuál es el primer nombre de tu madre?',
        sort: 7,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.usersSecurityQuestion,
      },
      {
        code: '8',
        description: '',
        name: '¿Cuál es el nombre de tu profesor favorito del colegio?',
        sort: 8,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.usersSecurityQuestion,
      },
      {
        code: '9',
        description: '',
        name: '¿Cuál es tu número favorito?',
        sort: 9,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.usersSecurityQuestion,
      },
      {
        code: '10',
        description: '',
        name: '¿Cuál es el segundo nombre de tu madre?',
        sort: 10,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.usersSecurityQuestion,
      },
    );

    for (const catalogue of catalogues) {
      await this.catalogueService.create(catalogue);
    }
  }
}
