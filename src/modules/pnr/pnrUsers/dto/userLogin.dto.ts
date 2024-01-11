import { IsString } from 'class-validator';

export class UserLoginDto {
  @IsString()
  phoneNumber: string;
  @IsString()
  countryCode: string;
}
