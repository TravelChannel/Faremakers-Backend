import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  // HttpStatus,
  // HttpException,
} from '@nestjs/common';
import { SEOAirlinesDataService } from './seoAirlinesData.service';
import { CreateSEOAirlinesDataDto } from './dto/create-seoAirlinesData.dto';
import { UpdateSEOAirlinesDataDto } from './dto/update-seoAirlinesData.dto';
import { ADMIN_SUBJECT } from 'src/common/aclSubjects';

import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';

@Controller('seoAirlinesData')
@UseGuards(RolesGuard)
@Roles(ADMIN_SUBJECT)
export class SEOAirlinesDataController {
  constructor(
    private readonly seoAirlinesDataService: SEOAirlinesDataService,
  ) {}

  @Post()
  async create() {
    return await this.seoAirlinesDataService.create();
  }

  @Get('dropdown')
  // @Roles(SUPERADMIN_ALL_COMPANIES_ADMIN_SUBJECT)
  getDropdown() {
    return this.seoAirlinesDataService.getDropdown();
  }

  @Get()
  findAll() {
    return this.seoAirlinesDataService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.seoAirlinesDataService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSEOAirlinesDataDto: UpdateSEOAirlinesDataDto,
  ) {
    return this.seoAirlinesDataService.update(+id, updateSEOAirlinesDataDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.seoAirlinesDataService.remove(+id);
  }
}
