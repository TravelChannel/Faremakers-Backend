import { IsNotEmpty, ArrayNotEmpty } from 'class-validator';
import { PnrBookingArrayDto } from './PnrBookingArray.dto';

export class PnrBookingDto {
  @IsNotEmpty({ message: 'phoneNumber is required.' })
  phoneNumber: number;

  @ArrayNotEmpty({ message: 'Provide at least one pnrBooking' })
  pnrBookings: PnrBookingArrayDto[];
}
