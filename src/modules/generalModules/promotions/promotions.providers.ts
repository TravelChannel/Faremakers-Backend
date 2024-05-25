import { Promotion } from './entities/promotion.entity';
import { PROMOTIONS_REPOSITORY } from '../../../shared/constants';

export const promotionsProviders = [
  {
    provide: PROMOTIONS_REPOSITORY,
    useValue: Promotion,
  },
];
