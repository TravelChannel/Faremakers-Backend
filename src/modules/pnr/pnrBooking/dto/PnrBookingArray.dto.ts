import { IsNotEmpty, IsOptional } from 'class-validator';
import { UserInfoDetails } from './userInfoDetails.dto';
// Test Commmit
export class PnrBookingArrayDto {
  @IsNotEmpty({ message: 'phoneNumber is required.' })
  phoneNumber: string;

  @IsOptional()
  userEmail?: string;

  userInfoDetails: UserInfoDetails;

  @IsNotEmpty({ message: 'PNR is required.' })
  pnr: string;
}
