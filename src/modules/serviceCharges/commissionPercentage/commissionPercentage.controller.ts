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
import { CommissionPercentageService } from './commissionPercentage.service';
import { CreateCommissionPercentageDto } from './dto/create-commissionPercentage.dto';
import { UpdateCommissionPercentageDto } from './dto/update-commissionPercentage.dto';
import { ADMIN_SUBJECT } from 'src/common/aclSubjects';
// import { ToggleIsActiveDto } from 'src/shared/dtos/toggleIsActive.dto';

import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';

@Controller('commissionPercentage')
@UseGuards(RolesGuard)
@Roles(ADMIN_SUBJECT)
export class CommissionPercentageController {
  constructor(
    private readonly promotionsService: CommissionPercentageService,
  ) {}

  @Post()
  async create(
    @Body() createCommissionPercentageDto: CreateCommissionPercentageDto,
  ) {
    return await this.promotionsService.create(createCommissionPercentageDto);
  }

  @Get('dropdown')
  // @Roles(SUPERADMIN_ALL_COMPANIES_ADMIN_SUBJECT)
  getDropdown() {
    return this.promotionsService.getDropdown();
  }

  @Get()
  findAll() {
    return this.promotionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.promotionsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCommissionPercentageDto: UpdateCommissionPercentageDto,
  ) {
    return this.promotionsService.update(+id, updateCommissionPercentageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.promotionsService.remove(+id);
  }
  @Patch('toggleStatus/:id')
  toggleStatus(
    @Param('id') id: string,
    // @Body() toggleIsActiveDto: ToggleIsActiveDto,
  ) {
    return this.promotionsService.toggleStatus(+id);
  }
}
