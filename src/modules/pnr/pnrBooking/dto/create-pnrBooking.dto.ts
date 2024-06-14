import { IsNotEmpty, ArrayNotEmpty, IsOptional } from 'class-validator';
import { PnrBookingArrayDto } from './PnrBookingArray.dto';

export class PnrBookingDto {
  @IsOptional()
  phoneNumber: string;
  @IsOptional()
  countryCode: string;
  @IsNotEmpty({ message: 'pnr is required.' })
  pnr: number;
  @IsOptional()
  OrderId: string;
  //added by nabeel
  @IsOptional()
  CheckSum: string;
  @ArrayNotEmpty({ message: 'Provide at least one pnrBookings' })
  pnrBookings: PnrBookingArrayDto[];
  @IsOptional()
  flightDetails: any;
  @IsOptional()
  MajorInfo: any;
  @IsOptional()
  leadCreationData: any;
  @IsOptional()
  sendSmsBranch: any;
  @IsOptional()
  sendSmsCod: any;
  @IsOptional()
  branchLabel: any;
  @IsOptional()
  userLocation: any;
  @IsOptional()
  Amount: any;
}
