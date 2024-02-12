import { PnrPayment } from './entities/pnrPayment.entity';
import { PROMOTIONS_REPOSITORY } from '../../../shared/constants';

export const pnrPaymentProviders = [
  {
    provide: PROMOTIONS_REPOSITORY,
    useValue: Promotion,
  },
];
