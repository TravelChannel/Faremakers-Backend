import { IsNotEmpty, IsOptional } from 'class-validator';
import { UserInfoDetails } from './userInfoDetails.dto';

export class PnrBookingArrayDto {
  @IsNotEmpty({ message: 'phoneNumber is required.' })
  phoneNumber: string;

  @IsOptional()
  userEmail?: string;

  userInfoDetails: UserInfoDetails;

  @IsNotEmpty({ message: 'PNR is required.' })
  pnr: string;
}
