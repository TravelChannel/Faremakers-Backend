import { IsNotEmpty, IsString } from 'class-validator';

export class PayzenAuthDto {
  @IsNotEmpty({ message: 'clientId is required.' })
  @IsString()
  clientId: string;
  @IsNotEmpty({ message: 'clientSecret is required.' })
  @IsString()
  clientSecret: string;
}
