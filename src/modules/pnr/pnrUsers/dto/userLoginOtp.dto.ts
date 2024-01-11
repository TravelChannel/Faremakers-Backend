import { IsString } from 'class-validator';

export class UserLoginOtpDto {
  @IsString()
  phoneNumber: string;
  @IsString()
  countryCode: string;
  @IsString()
  otp: string;
}
