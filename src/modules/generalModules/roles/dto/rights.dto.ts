import { IsNotEmpty, IsNumber } from 'class-validator';
export class Rights {
  @IsNotEmpty({ message: 'id is required.' })
  @IsNumber()
  id: number;
}
