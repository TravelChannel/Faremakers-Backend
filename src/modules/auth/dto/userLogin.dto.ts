import { IsString, IsNotEmpty } from 'class-validator';

export class UserLoginDto {
  @IsNotEmpty({ message: 'phoneNumber is required.' })
  @IsString()
  phoneNumber: string;
  @IsNotEmpty({ message: 'countryCode is required.' })
  @IsString()
  countryCode: string;
}
