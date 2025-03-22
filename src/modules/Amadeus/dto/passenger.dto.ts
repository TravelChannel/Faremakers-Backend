import { IsDate, IsNumber, IsString } from "class-validator";

export class PassengerDto {
    @IsNumber()
    passengerId: number;
  
    @IsString()
    orderId: string;
  
    @IsString()
    firstName: string;
  
    @IsString()
    lastName: string;
  
    @IsString()
    title: string;
  
    @IsString()
    gender: string;
  
    @IsDate()
    dateOfBirth: Date;
  
    @IsString()
    passportNo: string;
  
    @IsDate()
    passportExpiryDate: Date;
  
    @IsString()
    type: string;
  }