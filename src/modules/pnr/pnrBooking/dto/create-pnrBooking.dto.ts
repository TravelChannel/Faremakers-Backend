import { ArrayNotEmpty } from 'class-validator';
import { PnrBookingArrayDto } from './PnrBookingArray.dto';

export class PnrBookingDto {
  @ArrayNotEmpty({ message: 'Provide atleast one pnrBooking.' })
  pnrBooking: PnrBookingArrayDto[];
}
