import { PartialType } from '@nestjs/mapped-types';
import { CreateCommissionPercentageDto } from './create-commissionPercentage.dto';

export class UpdateCommissionPercentageDto extends PartialType(
  CreateCommissionPercentageDto,
) {}
