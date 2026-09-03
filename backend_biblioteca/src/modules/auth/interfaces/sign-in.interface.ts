import { RoleEntity } from '@auth/entities';
import { SchoolPeriodEntity } from '@modules/core/entities';

export interface SignInInterface {
  accessToken: string;
  refreshToken: string;
  auth: AuthInterface;
  roles: RoleEntity[];
  schoolPeriodOpen: SchoolPeriodEntity|null;
}

export interface AuthInterface {
  id: string;
  identification: string;
  lastname: string;
  name: string;
  username: string;
}
