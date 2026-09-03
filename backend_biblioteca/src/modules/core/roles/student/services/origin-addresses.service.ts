import { CoreRepositoryEnum } from '@modules/core/shared-core/enums';
import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateOriginAddressDto } from '../dto/origin-adresses/create-origin-address.dto';
import { OriginAddressEntity } from '@modules/core/entities';
import { UpdateOriginAddressDto } from '../dto/origin-adresses/update-origin-address.dto';

@Injectable()
export class OriginAddressesService {
  constructor(
    @Inject(CoreRepositoryEnum.originAddressRepository)
    private repository: Repository<OriginAddressEntity>,
  ) {}

  async create(payload: CreateOriginAddressDto): Promise<OriginAddressEntity> {
    const entity = this.repository.create(payload);

    return await this.repository.save(entity);
  }

  async update(id: string, payload: UpdateOriginAddressDto): Promise<boolean> {
    await this.repository.update(id, payload);
    return true;
  }
}
