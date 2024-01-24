import { Role } from './entities/role.entity';
import { PROMOTIONS_REPOSITORY } from '../../../shared/constants';

export const promotionsProvider = [
  {
    provide: PROMOTIONS_REPOSITORY,
    useValue: Role,
  },
];
