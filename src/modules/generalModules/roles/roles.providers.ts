import { Role } from './entities/role.entity';
import { ROLES_REPOSITORY } from 'src/shared/constants';

export const rolesProviders = [
  {
    provide: ROLES_REPOSITORY,
    useValue: Role,
  },
];
