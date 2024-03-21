import { Module } from '@nestjs/common';
import { PnrBookingsService } from './pnrBookings.service';
import { PnrBookingsController } from './pnrBookings.controller';
import { PnrBookingsProviders } from './pnrBookings.providers'; // Import the providers
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule], // Make sure UsersModule is imported here

  controllers: [PnrBookingsController],
  providers: [PnrBookingsService, ...PnrBookingsProviders],
})
export class PnrBookingsModule {}
