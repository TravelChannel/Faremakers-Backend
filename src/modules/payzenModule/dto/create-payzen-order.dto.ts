import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  Matches,
  IsPositive,
  IsDateString,
  Min,
  Max,
} from 'class-validator';

export class CreatePayZenOrderDto {
  @IsOptional()
  @IsNumber()
  PayZenID: number;

  @IsOptional()
  @IsString()
  ConsumerNo?: string;

  @IsOptional()
  @IsString()
  psidStatus?: string;

  @IsNotEmpty({ message: 'Challan number is missing' })
  @IsString({ message: 'Invalid challan number' })
  ChallanNo?: string;

  @IsNotEmpty({ message: 'Amount could not be NULL' })
  @Matches(/^[1-9]\d*$/, { message: 'Only positive numbers are allowed in amount' })
  amountPaid?: number;


  @IsNotEmpty({ message: 'Payment Date is missing' })
  @IsDateString({}, { message: 'Payment Date format is not correct' })
  paidDate?: string;

  @IsNotEmpty({ message: 'Payment Time is missing' })
  @Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, { message: 'Payment Time format is not correct' })
  paidTime?: string;

  @IsNotEmpty({ message: 'Bank Code is missing' })
  @Matches(/^[a-zA-Z0-9]+$/, { message: 'Special characters are not allowed in Bank Code' })
  @IsString()
  bankCode?: string;

  @IsOptional()
  @IsNumber()
  PnrBookingId?: number;
}
