import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CoreRepositoryEnum } from '@modules/core/shared-core/enums';
import { OriginAddressEntity, ResidenceAddressEntity } from '@modules/core/entities';

@Injectable()
export class LocationsService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @Inject(CoreRepositoryEnum.originAddressRepository)
    private readonly originRepository: Repository<OriginAddressEntity>,
    @Inject(CoreRepositoryEnum.residenceAddressRepository)
    private readonly residenceRepository: Repository<ResidenceAddressEntity>,
  ) {}

  async findOriginByUserId(userId: string): Promise<OriginAddressEntity | null> {
    return await this.originRepository.findOne({
      where: { modelId: userId },
      relations: {
        country: true,
        province: true,
        canton: true,
        parish: true,
      },
    });
  }

  async findResidenceByUserId(userId: string): Promise<ResidenceAddressEntity | null> {
    return await this.residenceRepository.findOne({
      where: { modelId: userId },
      relations: {
        country: true,
        province: true,
        canton: true,
        parish: true,
      },
    });
  }
}
