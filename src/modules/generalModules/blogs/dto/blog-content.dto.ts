import {
  IsNotEmpty,
  IsString,
  Length,
  // ArrayMinSize,
  // ValidateNested,
} from 'class-validator';
// import { Type } from 'class-transformer'; // You need to import Type from class-transformer

// import { Rights } from './rights.dto';
export class BlogContentDto {
  id: number;
  @IsNotEmpty({ message: 'heading is required.' })
  @IsString({ message: 'heading must be a string.' })
  @Length(3, 100, { message: 'heading must be between 3 and 25 characters.' })
  heading: string;

  @IsNotEmpty({ message: 'summary is required.' })
  @IsString({ message: 'summary must be a string.' })
  @Length(3, 2500, {
    message: 'summary must be between 3 and 2500 characters.',
  })
  summary: string;
}
