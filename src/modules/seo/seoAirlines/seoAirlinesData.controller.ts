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
// import { CreateSEOAirlinesDataDto } from './dto/create-seoAirlinesData.dto';
import { UpdateSEOAirlinesDataDto } from './dto/update-seoAirlinesData.dto';
import { ADMIN_SUBJECT } from 'src/common/aclSubjects';

import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
// import { SkipAuth } from 'src/common/decorators/skip-auth.decorator';

@Controller('seoAirlinesData')
@UseGuards(RolesGuard)
@Roles(ADMIN_SUBJECT)
export class SEOAirlinesDataController {
  constructor(
    private readonly seoAirlinesDataService: SEOAirlinesDataService,
  ) {}

  // @SkipAuth() // Apply the decorator here to exclude this route
  @Post()
  async create() {
    return await this.seoAirlinesDataService.create();
  }

  @Get('dropdown')
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
