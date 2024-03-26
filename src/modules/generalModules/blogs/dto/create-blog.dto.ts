import {
  IsNotEmpty,
  IsString,
  Length,
  // ArrayMinSize,
  // ValidateNested,
} from 'class-validator';
// import { Type } from 'class-transformer'; // You need to import Type from class-transformer

export class CreateBlogDto {
  img: string;
  @IsNotEmpty({ message: 'blogTypeId is required.' })
  blogTypeId: number;
  @IsNotEmpty({ message: 'mainTitle is required.' })
  @IsString({ message: 'mainTitle must be a string.' })
  @Length(3, 50, { message: 'mainTitle must be between 3 and 25 characters.' })
  mainTitle: string;

  @IsNotEmpty({ message: 'description is required.' })
  @IsString({ message: 'description must be a string.' })
  // @Length(3, 50, {
  //   message: 'description must be between 3 and 50 characters.',
  // })
  description: string;
  @IsNotEmpty({ message: 'shortDescription is required.' })
  @IsString({ message: 'shortDescription must be a string.' })
  @Length(3, 5000, {
    message: 'shortDescription must be between 3 and 500 characters.',
  })
  shortDescription: string;
  @IsNotEmpty({ message: 'headerUrl is required.' })
  @IsString({ message: 'headerUrl must be a string.' })
  @Length(3, 500, {
    message: 'headerUrl must be between 3 and 500 characters.',
  })
  headerUrl: string;
  @IsNotEmpty({ message: 'author is required.' })
  @IsString({ message: 'author must be a string.' })
  @Length(3, 100, {
    message: 'author must be between 3 and 500 characters.',
  })
  author: string;

  // @ArrayNotEmpty({ message: 'Please provide at least one role.' })
  // @ValidateNested({ each: true }) // Validate each item in the array
  // @Type(() => Rights) // Specify the class type for validation
  // rights: Rights[];
}
