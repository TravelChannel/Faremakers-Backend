import {
  IsNotEmpty,
  IsString,
  Length,
  // ArrayMinSize,
  ArrayNotEmpty,
  // ValidateNested,
} from 'class-validator';
// import { Type } from 'class-transformer'; // You need to import Type from class-transformer

import { BlogContentDto } from './blog-content.dto';
export class CreateBlogDto {
  img: string;
  @IsNotEmpty({ message: 'mainTitle is required.' })
  @IsString({ message: 'mainTitle must be a string.' })
  @Length(3, 50, { message: 'mainTitle must be between 3 and 25 characters.' })
  mainTitle: string;

  @IsNotEmpty({ message: 'description is required.' })
  @IsString({ message: 'description must be a string.' })
  @Length(3, 50, {
    message: 'description must be between 3 and 50 characters.',
  })
  description: string;
  @ArrayNotEmpty({ message: 'Please provide atleast one content .' })
  content: BlogContentDto[];
  // @ArrayNotEmpty({ message: 'Please provide at least one role.' })
  // @ValidateNested({ each: true }) // Validate each item in the array
  // @Type(() => Rights) // Specify the class type for validation
  // rights: Rights[];
}
