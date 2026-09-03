import { ResidenceAddressEntity } from '@modules/core/entities';
import { CoreRepositoryEnum } from '@modules/core/shared-core/enums';
import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateResidenceAddressDto } from '../dto/residence-adresses/create-residence-address.dto';
import { UpdateResidenceAddressDto } from '../dto/residence-adresses/update-residence-address.dto';

@Injectable()
export class ResidenceAddressesService {
  constructor(
    @Inject(CoreRepositoryEnum.residenceAddressRepository)
    private repository: Repository<ResidenceAddressEntity>,
  ) {}

  async create(payload: CreateResidenceAddressDto): Promise<ResidenceAddressEntity> {
    const entity = this.repository.create(payload);

    return await this.repository.save(entity);
  }

  async update(id: string, payload: UpdateResidenceAddressDto): Promise<boolean> {
    await this.repository.update(id, payload);
    return true;
  }
}
