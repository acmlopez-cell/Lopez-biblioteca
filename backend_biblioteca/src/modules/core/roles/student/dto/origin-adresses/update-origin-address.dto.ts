import { PartialType } from '@nestjs/swagger';
import { CreateOriginAddressDto } from './create-origin-address.dto';

export class UpdateOriginAddressDto extends PartialType(CreateOriginAddressDto) {}
