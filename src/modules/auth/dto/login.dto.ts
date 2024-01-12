import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'countryCode is required.' })
  @IsString()
  countryCode: string;
  @IsNotEmpty({ message: 'phoneNumber is required.' })
  @IsString()
  phoneNumber: string;

  @IsNotEmpty({ message: 'otp is required.' })
  @IsString()
  otp: string;
}
