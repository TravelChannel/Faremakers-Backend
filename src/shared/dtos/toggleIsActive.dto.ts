import { IsNotEmpty } from 'class-validator';
export class ToggleIsActiveDto {
  @IsNotEmpty({ message: 'isActive is required.' })
  isActive: number;
}
