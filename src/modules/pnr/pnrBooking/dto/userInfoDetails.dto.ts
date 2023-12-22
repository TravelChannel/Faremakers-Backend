import {
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsISO8601,
  IsDate,
} from 'class-validator';
export class UserInfoDetails {
  // @ApiProperty({ example: '2023-09-28', description: 'Date of Birth' })
  // @IsOptional()
  @IsDate()
  // @IsDateString()
  dateOfBirth?: Date;
  // @Transform(({ value }) => new Date(value))
  // @ApiProperty({ example: '2023-09-28', description: 'passportExpiryDate' })
  // @IsOptional()
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
