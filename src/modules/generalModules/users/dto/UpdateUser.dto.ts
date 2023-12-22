import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsOptional,
  // Min,
  // Max,
  // IsInt,
  // IsNumber,
  Length,
  // ValidateNested,
} from 'class-validator';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Type, Exclude } from 'class-transformer';

import // CreateUserDepartmentDto,
// CreateUserBranchDto,
// CreateUserCompanyDto,
// Role,
'./others.dto';

export class UpdateUserDto {
  // @Exclude()
  id: number;
  @IsNotEmpty({ message: 'Username is required.' })
  @IsString({ message: 'Username must be a string.' })
  @Length(3, 50, { message: 'Username must be between 3 and 50 characters.' })
  username: string;
  @IsNotEmpty({ message: 'firstName is required.' })
  @IsString({ message: 'firstName must be a string.' })
  @Length(3, 50, { message: 'firstName must be between 3 and 50 characters.' })
  firstName: string;
  @IsNotEmpty({ message: 'lastName is required.' })
  @IsString({ message: 'lastName must be a string.' })
  @Length(1, 50, { message: 'lastName must be between 3 and 50 characters.' })
  lastName: string;
  @IsNotEmpty({ message: 'Contact is required.' })

  // @IsNumber({}, { message: 'Contact must be a number.' })
  // @IsInt({ message: 'Contact must be an integer.' })
  // @Min(10, { message: 'Contact must be at least 10 digits.' })
  @Length(10, 50, { message: 'Contact must be between 3 and 50 characters.' })

  // @Max(50, { message: 'Contact must not exceed 50 digits.' })
  contact: string;

  @IsNotEmpty({ message: 'Email is required.' })
  @IsEmail({}, { message: 'Invalid email format.' })
  email: string;
  @IsOptional()
  imgSrc: any;
}
