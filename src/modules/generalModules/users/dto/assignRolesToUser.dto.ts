import {
  IsNotEmpty,
  IsArray,
  ArrayNotEmpty,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class AssignRolesToUserDto {
  @IsNotEmpty({ message: 'companyId is required.' })
  companyId: number;
  @Type(() => Number) // Convert each item in the array to a number
  @IsArray({ message: 'Roles must be an array.' })
  @ArrayNotEmpty({ message: 'Please provide at least one role.' })
  roles: number[];
  @IsOptional() // Make companyId optional
  branchId?: number;
  @IsOptional() // Make companyId optional
  departmentId?: number;
}
