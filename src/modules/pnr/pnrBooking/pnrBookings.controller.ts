/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpException,
  HttpStatus,
  Session,
  Req,
  Query,
} from '@nestjs/common';
import { SkipAuth } from '../../../common/decorators/skip-auth.decorator';

import { CurrentCompanyId } from 'src/common/decorators/currentCompanyId.decorator';
import { ToggleIsActiveDto } from 'src/shared/dtos/toggleIsActive.dto';
import { PnrBookingDto } from './dto/create-pnrBooking.dto';

import { getUserCompanyId } from '../../auth/getUserDecodedData';

import { RolesGuard } from '../../../common/guards/roles.guard';

// import { AuthGuard } from '../../../common/guards/auth.guard';
import { Roles } from '../../../common/decorators/roles.decorator';

import { PnrBookingsService } from './pnrBookings.service';

import { SessionData } from 'express-session';
import {
  ACCOUNTS_SUBJECT,
  SUPERADMIN_ALL_COMPANIES_ADMIN_SUBJECT,
} from 'src/common/aclSubjects';

@Controller('pnrBooking')
// @UseGuards(RolesGuard)
// @Roles(ACCOUNTS_SUBJECT)
export class PnrBookingsController {
  constructor(private readonly pnrBookingsService: PnrBookingsService) {}
  @Post()
  @SkipAuth()
  async create(@Body() pnrBookingDto: PnrBookingDto) {
    return await this.pnrBookingsService.create(pnrBookingDto);
  }
  @Get()
  @SkipAuth()
  async findAll() {
    return await this.pnrBookingsService.findAll();
  }
  @Get('findBy')
  @SkipAuth()
  async findBy(@Req() req: Request): Promise<any> {
    return this.pnrBookingsService.findBy(req);
  }
  @Get(':id')
  @SkipAuth()
  async findOne(@Param('id') id: string): Promise<any> {
    return this.pnrBookingsService.findOne(id);
  }
}
