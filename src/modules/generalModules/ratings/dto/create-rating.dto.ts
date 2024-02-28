import {
  IsNotEmpty,
  IsString,
  Length,
  // IsISO8601,
  // ArrayMinSize,
  // ArrayNotEmpty,
  // ValidateNested,
} from 'class-validator';
// import { Type } from 'class-transformer'; // You need to import Type from class-transformer

// import { Rights } from './rights.dto';
export class CreateRatingDto {
  @IsNotEmpty({ message: 'title is required.' })
  @IsString({ message: 'title must be a string.' })
  @Length(3, 50, { message: 'title must be between 3 and 25 characters.' })
  title: string;

  @IsNotEmpty({ message: 'description is required.' })
  @IsString({ message: 'description must be a string.' })
  @Length(3, 50, {
    message: 'description must be between 3 and 50 characters.',
  })
  review: string;
  @IsNotEmpty({ message: 'stars is required.' })
  stars: number;
}
