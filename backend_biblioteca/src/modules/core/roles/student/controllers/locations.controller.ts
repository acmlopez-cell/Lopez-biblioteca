import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth, PublicRoute, Roles } from '@auth/decorators';
import { ResponseHttpInterface } from '@utils/interfaces';
import { LocationsService } from '../services/locations.service';
import { RoleEnum } from '@auth/enums';

@ApiTags('Locations')
// @Auth()
@Controller('core/student/locations')
export class LocationsController {
  constructor(private locationsService: LocationsService) {}
}
