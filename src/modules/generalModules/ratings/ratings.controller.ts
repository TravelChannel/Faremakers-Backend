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
import { RatingsService } from './ratings.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { ADMIN_AND_USER_SUBJECT, ADMIN_SUBJECT } from 'common/aclSubjects';
// import { ToggleIsActiveDto } from 'shared/dtos/toggleIsActive.dto';
import { SkipAuth } from 'common/decorators/skip-auth.decorator';

import { RolesGuard } from 'common/guards/roles.guard';
import { Roles } from 'common/decorators/roles.decorator';

@Controller('ratings')
@UseGuards(RolesGuard)
@Roles(ADMIN_AND_USER_SUBJECT)
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @Post()
  async create(@Body() createRatingDto: CreateRatingDto) {
    return await this.ratingsService.create(createRatingDto);
  }

  @Get('dropdown')
  getDropdown() {
    return this.ratingsService.getDropdown();
  }

  @Get()
  @SkipAuth()
  findAll() {
    return this.ratingsService.findAll();
  }

  @Get('allData')
  @Roles(ADMIN_SUBJECT)
  findAllForAdmin() {
    return this.ratingsService.findAllForAdmin();
  }

  @Get(':id')
  @SkipAuth()
  findOne(@Param('id') id: string) {
    return this.ratingsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRatingDto: UpdateRatingDto) {
    return this.ratingsService.update(+id, updateRatingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ratingsService.remove(+id);
  }
  @Patch('toggleStatus/:id')
  toggleStatus(
    @Param('id') id: string,
    // @Body() toggleIsActiveDto: ToggleIsActiveDto,
  ) {
    return this.ratingsService.toggleStatus(+id);
  }
}
