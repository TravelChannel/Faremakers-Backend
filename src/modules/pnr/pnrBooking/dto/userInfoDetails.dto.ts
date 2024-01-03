import {
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsISO8601,
  IsDate,
} from 'class-validator';
export class UserInfoDetails {
  @IsDate()
  dateOfBirth?: Date;
  @IsISO8601({ strict: true })
  @IsDateString()
  @IsDate()
  passportExpiryDate: Date;
  @IsOptional()
  firstName?: string;
  @IsOptional()
  lastName?: string;
  @IsOptional()
  gender?: string;
  @IsNotEmpty({ message: 'CNIC is required.' })
  cnic: string;
  @IsOptional()
  passportNo?: string;
}
