import { IsNotEmpty, ArrayNotEmpty } from 'class-validator';
export class AddRightsInRoleDto {
  @IsNotEmpty({ message: 'Role is required.' })
  roleId: number;

  @ArrayNotEmpty({ message: 'Please provide atleast one Right .' })
  rights: Right[];
}
interface Right {
  id: number;
}
