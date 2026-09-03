import { PartialType } from '@nestjs/swagger';
import { CreateResidenceAddressDto } from './create-residence-address.dto';

export class UpdateResidenceAddressDto extends PartialType(CreateResidenceAddressDto) {}
