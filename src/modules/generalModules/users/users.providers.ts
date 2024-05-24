import { User } from './entities/user.entity';
import { USERS_REPOSITORY } from 'src/shared/constants';

export const usersProviders = [
  {
    provide: USERS_REPOSITORY,
    useValue: User,
  },
];
