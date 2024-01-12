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
import { CurrentUserId } from 'src/common/decorators/currentUserId.decorator';

// import { SkipAuth } from '../../../common/decorators/skip-auth.decorator';

import { IsCurrentUserAdmin } from 'src/common/decorators/isCurrentUserAdmin.decorator';
import { ToggleIsActiveDto } from 'src/shared/dtos/toggleIsActive.dto';
import { PnrBookingDto } from './dto/create-pnrBooking.dto';

import { getUserCompanyId } from '../../auth/getUserDecodedData';
import { PnrBooking } from './entities/pnrBooking.entity';

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
  async create(
    @Body() pnrBookingDto: PnrBookingDto,
    @IsCurrentUserAdmin() isCurrentUserAdmin: number,
    @CurrentUserId() currentUserId: number,
  ) {
    return await this.pnrBookingsService.create(
      currentUserId,
      isCurrentUserAdmin,
      pnrBookingDto,
    );
  }
  @Get()
  async findAll(
    @Req() req: Request,
    @IsCurrentUserAdmin() isCurrentUserAdmin: number,
    @CurrentUserId() currentUserId: number,
  ): Promise<PnrBooking[]> {
    return await this.pnrBookingsService.findAll(
      req,
      isCurrentUserAdmin,
      currentUserId,
    );
  }
  @Get('findBy')
  async findBy(@Req() req: Request): Promise<any> {
    return this.pnrBookingsService.findBy(req);
  }
  @Get('findByPnr')
  async findByPnr(@Req() req: Request): Promise<any> {
    return this.pnrBookingsService.findByPnr(req);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<any> {
    return this.pnrBookingsService.findOne(id);
  }

  @Patch('reqForCancellation/:id')
  reqForCancellation(@Param('id') id: string) {
    return this.pnrBookingsService.reqForCancellation(+id);
  }
  @Patch('reqForRefund/:id')
  reqForRefund(@Param('id') id: string) {
    return this.pnrBookingsService.reqForRefund(+id);
  }
  @Patch('reqForReIssue/:id')
  reqForReIssue(@Param('id') id: string) {
    return this.pnrBookingsService.reqForReIssue(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pnrBookingsService.remove(+id);
  }
}
