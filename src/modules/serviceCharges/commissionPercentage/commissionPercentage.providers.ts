import { CommissionPercentage } from './entities/commissionPercentage.entity';
import { COMMISSION_PERCENTAGE_REPOSITORY } from 'shared/constants';

export const commissionPercentageProviders = [
  {
    provide: COMMISSION_PERCENTAGE_REPOSITORY,
    useValue: CommissionPercentage,
  },
];
