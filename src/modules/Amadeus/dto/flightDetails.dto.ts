import { IsArray, IsDate, IsNumber, IsString, ValidateNested } from "class-validator";
import { Type } from 'class-transformer';
import { LayoverDto } from './layover.dto';

export class FlightDetailsDto {
    @IsNumber()
    flightId: number;
  
    @IsString()
    orderId: string;
  
    @IsString()
    departure: string;
  
    @IsString()
    arrival: string;
  
    @IsDate()
    departDate: Date;
  
    @IsDate()
    arrivalDate: Date;
  
    @IsString()
    departTime: string;
  
    @IsString()
    arrivalTime: string;
  
    @IsString()
    marketingCarrier: string;
  
    @IsString()
    flightNumber: string;
  
    @IsString()
    bookingClass: string;
  
    @IsString()
    cabinClass: string;
  
    @IsString()
    baggageAllowance: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => LayoverDto)
    layovers: LayoverDto[];
  }