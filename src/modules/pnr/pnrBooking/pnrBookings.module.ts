import { Module } from '@nestjs/common';
import { PnrBookingsService } from './pnrBookings.service';
import { PnrBookingsController } from './pnrBookings.controller';
import { PnrBookingsProviders } from './pnrBookings.providers'; // Import the providers

@Module({
  controllers: [PnrBookingsController],
  providers: [PnrBookingsService, ...PnrBookingsProviders],
})
export class PnrBookingsModule {}
