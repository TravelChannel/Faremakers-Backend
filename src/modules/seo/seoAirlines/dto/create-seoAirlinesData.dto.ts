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
export class CreateSEOAirlinesDataDto {
  @IsNotEmpty({ message: 'title is required.' })
  @IsString({ message: 'title must be a string.' })
  @Length(3, 50, { message: 'title must be between 3 and 25 characters.' })
  flightname: string;

  @IsNotEmpty({ message: 'description is required.' })
  @IsString({ message: 'description must be a string.' })
  @Length(3, 50, {
    message: 'description must be between 3 and 50 characters.',
  })
  flightCode: string;
  // @ArrayNotEmpty({ message: 'Please provide at least one role.' })
  // @ValidateNested({ each: true }) // Validate each item in the array
  // @Type(() => Rights) // Specify the class type for validation
  // rights: Rights[];
}
