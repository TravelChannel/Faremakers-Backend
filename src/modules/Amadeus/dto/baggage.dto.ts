import { IsNumber, IsString } from "class-validator";

export class BaggageDto {
    @IsNumber()
    baggageId: number;
  
    @IsNumber()
    passengerId: number;
  
    @IsNumber()
    flightId: number;
  
    @IsString()
    baggageAllowance: string;
  }