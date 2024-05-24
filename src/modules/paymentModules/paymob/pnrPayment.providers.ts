import { PnrPayment } from './entities/pnrPayment.entity';
import { PNRPAYMENT_REPOSITORY } from 'src/shared/constants';

export const pnrPaymentProviders = [
  {
    provide: PNRPAYMENT_REPOSITORY,
    useValue: PnrPayment,
  },
];
