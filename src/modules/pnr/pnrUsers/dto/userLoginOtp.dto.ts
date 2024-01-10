import { IsString } from 'class-validator';

export class UserLoginOtpDto {
  @IsString()
  phoneNumber: string;
  @IsString()
  otp: string;
}
