import {
  IsNotEmpty,
  // ArrayMinSize,
  // ArrayNotEmpty,
  // ValidateNested,
} from 'class-validator';
// import { Type } from 'class-transformer'; // You need to import Type from class-transformer

// import { Rights } from './rights.dto';
export class CreateCommissionPercentageDto {
  @IsNotEmpty({ message: 'percentage is required.' })
  percentage: number;
  @IsNotEmpty({ message: 'airlineId is required.' })
  airlineId: number;
  @IsNotEmpty({ message: 'fareClassId is required.' })
  fareClassId: number;
  @IsNotEmpty({ message: 'sectorId is required.' })
  sectorId: number;
}
