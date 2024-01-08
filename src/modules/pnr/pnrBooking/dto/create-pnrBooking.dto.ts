import { IsNotEmpty, ArrayNotEmpty, IsOptional } from 'class-validator';
import { PnrBookingArrayDto } from './PnrBookingArray.dto';

export class PnrBookingDto {
  @IsNotEmpty({ message: 'phoneNumber is required.' })
  phoneNumber: number;
  @IsNotEmpty({ message: 'pnr is required.' })
  pnr: number;

  @ArrayNotEmpty({ message: 'Provide at least one pnrBookings' })
  pnrBookings: PnrBookingArrayDto[];
  @IsOptional()
  flightDetails: any;
}
