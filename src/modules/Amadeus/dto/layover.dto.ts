import { IsNumber, IsString } from "class-validator";

export class LayoverDto {
    @IsNumber()
    layoverId: number;
  
    @IsNumber()
    flightId: number;
  
    @IsString()
    location: string;
  
    @IsString()
    duration: string;
  }