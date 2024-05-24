import { Rating } from './entities/rating.entity';
import { RATINGS_REPOSITORY } from 'src/shared/constants';

export const ratingsProviders = [
  {
    provide: RATINGS_REPOSITORY,
    useValue: Rating,
  },
];
