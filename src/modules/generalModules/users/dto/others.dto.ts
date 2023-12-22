import {
  IsNotEmpty,
  // IsString,
  // IsEmail,
  // Length,
  // ArrayNotEmpty,
} from 'class-validator';

export class CreateUserBranchDto {
  @IsNotEmpty({ message: 'PLease provide id .' })
  id: number;
  @IsNotEmpty({ message: 'PLease provide branchId .' })
  branchId: number;
}
export class CreateUserDepartmentDto {
  @IsNotEmpty({ message: 'PLease provide id .' })
  id: number;
  @IsNotEmpty({ message: 'PLease provide departmentId .' })
  departmentId: number;
}
export class CreateUserCompanyDto {
  @IsNotEmpty({ message: 'PLease provide id .' })
  id: number;
}
export class Role {
  @IsNotEmpty({ message: 'PLease provide id .' })
  id: number;
}
