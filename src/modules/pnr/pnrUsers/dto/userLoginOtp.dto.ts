import { IsString, IsNotEmpty } from 'class-validator';

export class UserLoginOtpDto {
  @IsNotEmpty({ message: 'phoneNumber is required.' })
  @IsString()
  phoneNumber: string;
  @IsNotEmpty({ message: 'countryCode is required.' })
  @IsString()
  countryCode: string;
  @IsNotEmpty({ message: 'otp is required.' })
  @IsString()
  otp: string;
}
