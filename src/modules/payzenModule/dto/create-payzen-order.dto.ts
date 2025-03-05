import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreatePayZenOrderDto {
  @IsNotEmpty()
  @IsNumber()
  PayZenID: number;

  @IsOptional()
  @IsString()
  ConsumerNo?: string;

  @IsOptional()
  @IsString()
  psidStatus?: string;

  @IsOptional()
  @IsString()
  ChallanNo?: string;

  @IsOptional()
  @IsString()
  amountPaid?: string;

  @IsOptional()
  @IsString()
  paidDate?: string;

  @IsOptional()
  @IsString()
  paidTime?: string;

  @IsOptional()
  @IsString()
  bankCode?: string;

  @IsOptional()
  @IsNumber()
  PnrBookingId?: number;
}
