import { PnrUser } from './entities/pnrUsers.entity';
import { PNR_USERS_REPOSITORY } from 'src/shared/constants';

export const PnrUsersProviders = [
  {
    provide: PNR_USERS_REPOSITORY,
    useValue: PnrUser,
  },
];
