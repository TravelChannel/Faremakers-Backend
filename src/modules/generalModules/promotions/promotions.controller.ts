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
import { PromotionsService } from './promotions.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
// import { AddRightsInRoleDto } from './dto/addRightsInRole.dto';
import { SUPERADMIN_ALL_COMPANIES_ADMIN_SUBJECT } from 'src/common/aclSubjects';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RolesGuard } from '../../../common/guards/roles.guard';

@Controller('promotions')
@UseGuards(RolesGuard)
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Post()
  async create(@Body() createRoleDto: CreateRoleDto) {
    return await this.promotionsService.create(createRoleDto);
  }

  @Get('dropdown')
  @Roles(SUPERADMIN_ALL_COMPANIES_ADMIN_SUBJECT)
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
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.promotionsService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.promotionsService.remove(+id);
  }
}
