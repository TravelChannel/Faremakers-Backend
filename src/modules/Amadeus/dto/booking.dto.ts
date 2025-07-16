import {
  IsString,
  IsNumber,
  IsOptional,
  IsDate,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PassengerDto } from './passenger.dto';
import { FlightDetailsDto } from 'src/modules/Amadeus/dto/flightDetails.dto';
import { FareDetailsDto } from 'src/modules/Amadeus/dto/fareDetails.dto';

export class BookingDto {
  @IsString()
  OrderId: string;

  @IsString()
  pnr: string;

  @IsNumber()
  countryCode: number;

  @IsString()
  phoneNumber: string;

  @IsOptional()
  @IsDate()
  createdAt?: Date = new Date(); // Set default to current timestamp

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PassengerDto)
  pnrBookings: PassengerDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FlightDetailsDto)
  flightDetails: FlightDetailsDto[];

  @ValidateNested()
  @Type(() => FareDetailsDto)
  totalFare: FareDetailsDto;
}
