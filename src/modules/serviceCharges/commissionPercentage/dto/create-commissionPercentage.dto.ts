import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  // ArrayMinSize,
  // ArrayNotEmpty,
  // ValidateNested,
} from 'class-validator';
// import { Type } from 'class-transformer'; // You need to import Type from class-transformer

// import { Rights } from './rights.dto';
export class CreateCommissionPercentageDto {
  @IsNumber({ allowInfinity: false }, { message: 'Must be a number' })
  @IsNotEmpty({ message: 'percentage is required.' })
  percentage: number;
  @IsOptional()

  // @IsNotEmpty({ message: 'airlineId is required.' })
  airlineId: number;
  // @IsNotEmpty({ message: 'fareClassId is required.' })
  @IsOptional()
  fareClassId: number;
  // @IsNotEmpty({ message: 'sectorId is required.' })
  @IsOptional()
  sectorId: number;
}
