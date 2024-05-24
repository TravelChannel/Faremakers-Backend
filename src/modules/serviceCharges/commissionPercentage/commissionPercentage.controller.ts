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
import { SkipAuth } from 'common/decorators/skip-auth.decorator';

import { CommissionPercentageService } from './commissionPercentage.service';
import { CreateCommissionPercentageDto } from './dto/create-commissionPercentage.dto';
import { UpdateCommissionPercentageDto } from './dto/update-commissionPercentage.dto';
import { ADMIN_SUBJECT } from 'common/aclSubjects';
// import { ToggleIsActiveDto } from 'shared/dtos/toggleIsActive.dto';

import { RolesGuard } from 'common/guards/roles.guard';
import { Roles } from 'common/decorators/roles.decorator';

@Controller('commissionPercentage')
@UseGuards(RolesGuard)
@Roles(ADMIN_SUBJECT)
export class CommissionPercentageController {
  constructor(
    private readonly commissionPercentageService: CommissionPercentageService,
  ) {}

  @Post()
  async create(
    @Body() createCommissionPercentageDto: CreateCommissionPercentageDto,
  ) {
    return await this.commissionPercentageService.create(
      createCommissionPercentageDto,
    );
  }

  @Post('getServiceCharges')
  @SkipAuth()
  getServiceCharges(@Body() majorInfo: any) {
    return this.commissionPercentageService.getServiceCharges(majorInfo);
  }
  @Get('getAirlineDropdown')
  getAirlineDropdown() {
    return this.commissionPercentageService.getAirlineDropdown();
  }
  @Get('getSectorDropdown')
  getSectorDropdown() {
    return this.commissionPercentageService.getSectorDropdown();
  }
  @Get('getFareClassDropdown')
  getFareClassDropdown() {
    return this.commissionPercentageService.getFareClassDropdown();
  }
  @Get()
  findAll() {
    return this.commissionPercentageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commissionPercentageService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCommissionPercentageDto: UpdateCommissionPercentageDto,
  ) {
    return this.commissionPercentageService.update(
      +id,
      updateCommissionPercentageDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commissionPercentageService.remove(+id);
  }
  @Patch('toggleStatus/:id')
  toggleStatus(
    @Param('id') id: string,
    // @Body() toggleIsActiveDto: ToggleIsActiveDto,
  ) {
    return this.commissionPercentageService.toggleStatus(+id);
  }
}
