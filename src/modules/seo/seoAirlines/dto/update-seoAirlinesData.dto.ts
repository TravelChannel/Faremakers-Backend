import { PartialType } from '@nestjs/mapped-types';
import { CreateSEOAirlinesDataDto } from './create-seoAirlinesData.dto';

export class UpdateSEOAirlinesDataDto extends PartialType(
  CreateSEOAirlinesDataDto,
) {}
