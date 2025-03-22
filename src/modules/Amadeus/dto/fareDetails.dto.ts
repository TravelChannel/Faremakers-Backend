import { IsBoolean, IsNumber, IsString } from "class-validator";

export class FareDetailsDto {
    @IsNumber()
    fareId: number;
  
    @IsString()
    orderId: string;
  
    @IsNumber()
    passengerId: number;
  
    @IsString()
    rateClass: string;
  
    @IsNumber()
    fareAmount: number;
  
    @IsString()
    currency: string;
  
    @IsBoolean()
    refundable: boolean;
  }