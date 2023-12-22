import { Role } from './entities/role.entity';
import { ROLES_REPOSITORY } from '../../../shared/constants';

export const rolesProviders = [
  {
    provide: ROLES_REPOSITORY,
    useValue: Role,
  },
];
