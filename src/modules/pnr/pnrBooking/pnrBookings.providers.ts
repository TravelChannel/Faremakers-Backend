import { PnrBooking } from './entities/pnrBooking.entity';
import { PNR_BOOKINGS_REPOSITORY } from 'src/shared/constants';

export const PnrBookingsProviders = [
  {
    provide: PNR_BOOKINGS_REPOSITORY,
    useValue: PnrBooking,
  },
];
