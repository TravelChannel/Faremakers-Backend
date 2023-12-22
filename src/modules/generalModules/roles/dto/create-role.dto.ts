import {
  IsNotEmpty,
  IsString,
  Length,
  ArrayMinSize,
  // ArrayNotEmpty,
  // ValidateNested,
} from 'class-validator';
// import { Type } from 'class-transformer'; // You need to import Type from class-transformer

// import { Rights } from './rights.dto';
export class CreateRoleDto {
  @IsNotEmpty({ message: 'name is required.' })
  @IsString({ message: 'name must be a string.' })
  @Length(3, 50, { message: 'name must be between 3 and 25 characters.' })
  name: string;

  @IsNotEmpty({ message: 'description is required.' })
  @IsString({ message: 'description must be a string.' })
  @Length(3, 50, {
    message: 'description must be between 3 and 50 characters.',
  })
  description: string;
  // @ArrayNotEmpty({ message: 'Please provide at least one role.' })
  // @ValidateNested({ each: true }) // Validate each item in the array
  // @Type(() => Rights) // Specify the class type for validation
  // rights: Rights[];
  @IsNotEmpty({ message: 'Right is required.' })
  @ArrayMinSize(1, { message: 'At least one right is required.' })
  rights: number[];
}
