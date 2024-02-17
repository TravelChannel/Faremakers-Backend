import {
  IsNotEmpty,
  IsString,
  Length,
  // ArrayMinSize,
  // ArrayNotEmpty,
  // ValidateNested,
} from 'class-validator';
// import { Type } from 'class-transformer'; // You need to import Type from class-transformer

// import { Rights } from './rights.dto';
export class CreateBlogDto {
  @IsNotEmpty({ message: 'title is required.' })
  @IsString({ message: 'title must be a string.' })
  @Length(3, 50, { message: 'title must be between 3 and 25 characters.' })
  title: string;

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
}
