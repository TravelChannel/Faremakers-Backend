import {
  Controller,
  Get,
  Post,
  // Body,
  Param,
  UseGuards,
  // HttpStatus,
  // HttpException,
} from '@nestjs/common';
import { PnrPaymentService } from './pnrPayment.service';
import { ADMIN_SUBJECT } from 'src/common/aclSubjects';
// import { ToggleIsActiveDto } from 'src/shared/dtos/toggleIsActive.dto';

import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';

@Controller('pnrPayment')
@UseGuards(RolesGuard)
@Roles(ADMIN_SUBJECT)
export class PnrPaymentController {
  constructor(private readonly pnrPaymentService: PnrPaymentService) {}

  @Post()
  async create() {
    return await this.pnrPaymentService.create();
  }

  @Get()
  findAll() {
    return this.pnrPaymentService.findAll();
  }

  @Get('ByPnr/:id')
  findByPnr(@Param('id') id: string) {
    return this.pnrPaymentService.findByPnr(id);
  }
  @Get('byBookingId/:id')
  byBookingId(@Param('id') id: string) {
    return this.pnrPaymentService.byBookingId(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pnrPaymentService.findOne(+id);
  }
}
