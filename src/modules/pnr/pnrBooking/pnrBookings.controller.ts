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
  Res,
  Put,
} from '@nestjs/common';
import { Response } from 'express';

import { CurrentUserId } from 'src/common/decorators/currentUserId.decorator';

import { SkipAuth } from '../../../common/decorators/skip-auth.decorator';

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
  ADMIN_AND_USER_SUBJECT,
  PARTIAL_ADMIN_SUBJECT,
  ALL_ADMINS,
} from 'src/common/aclSubjects';
require('dotenv').config();

@Controller('pnrBooking')
export class PnrBookingsController {
  constructor(private readonly pnrBookingsService: PnrBookingsService) { }
  @Post()
  async create(
    @Body() pnrBookingDto: PnrBookingDto,
    @CurrentUserId() currentUserId: number,
    @IsCurrentUserAdmin() isCurrentUserAdmin: number,
  ) {
    return await this.pnrBookingsService.create(
      currentUserId,
      isCurrentUserAdmin,
      pnrBookingDto,
    );
  }
  @Post('processPayment')
  @SkipAuth()
  async processPayment(
    @Body() callbackData: any,
    @Req() req: Request,

    // @Res() res: Response,
  ): Promise<any> {
    return await this.pnrBookingsService.processPayment(
      callbackData,
      // req,
      // res
    );
  }

  @Get('TEST_CODE')
  @SkipAuth()
  async TestCode() {
    let pp_TxnType = 'MWALLET';

    let invoiceAmount = 22346.16; // Convert amount to main currency unit
    let comissionPerc = 2.32; // Default commission percentage
    try {
      // Use the appropriate commission based on transaction type
      if (pp_TxnType === 'MWALLET') {
        comissionPerc = parseFloat(process.env.COMMISSION_MWALLET);
      } else {
        comissionPerc = parseFloat(process.env.COMMISSION_OTC);
      }
    } catch (error) { }

    invoiceAmount = invoiceAmount * (1 - comissionPerc / 100);
    return invoiceAmount;
  }

  @Post('processPaymentJazzCash')
  @SkipAuth()
  async processPaymentJazzCash(
    @Body() callbackData: any,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    await this.pnrBookingsService.processPaymentJazzCash(callbackData);
    // Perform the redirect after processing
    res.redirect(
      `https://www.faremakers.com/previewEticket?order=${encodeURIComponent(callbackData.ppmpf_1)}`,
    );
  }

  @Get()
  // @SkipAuth()
  async findAll(
    @Req() req: Request,
    @CurrentUserId() currentUserId: number,
    @IsCurrentUserAdmin() isCurrentUserAdmin: number,
  ): Promise<PnrBooking[]> {
    return await this.pnrBookingsService.findAll(
      req,
      currentUserId,
      isCurrentUserAdmin,
    );
  }
  @Get('paid')
  async findAllWithPayment(
    @Req() req: Request,
    @CurrentUserId() currentUserId: number,
    @IsCurrentUserAdmin() isCurrentUserAdmin: number,
  ): Promise<PnrBooking[]> {
    return await this.pnrBookingsService.findAllWithPayment(
      req,
      currentUserId,
      isCurrentUserAdmin,
    );
  }
  @Get('findBy')
  async findBy(
    @Req() req: Request,
    @CurrentUserId() currentUserId: number,
    @IsCurrentUserAdmin() isCurrentUserAdmin: number,
  ): Promise<any> {
    return this.pnrBookingsService.findBy(
      req,
      currentUserId,
      isCurrentUserAdmin,
    );
  }
  @SkipAuth()
  @Put('createLeadCrm')
  async createLeadCrm(@Body() body: any): Promise<any> {
    return this.pnrBookingsService.createLeadCrm(body);
  }
  @Get('findByPnr')
  async findByPnr(@Req() req: Request): Promise<any> {
    return this.pnrBookingsService.findByPnr(req);
  }

  @SkipAuth()
  @Get('findByOrderId')
  async findByOrderId(@Req() req: Request): Promise<any> {
    return this.pnrBookingsService.findByOrderId(req);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @CurrentUserId() currentUserId: number,
    @IsCurrentUserAdmin() isCurrentUserAdmin: number,
  ): Promise<any> {
    return this.pnrBookingsService.findOne(
      id,
      currentUserId,
      isCurrentUserAdmin,
    );
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

  @Patch('doneCancellation/:id')
  @UseGuards(RolesGuard)
  @Roles(ALL_ADMINS)
  doneCancellation(@Param('id') id: string) {
    return this.pnrBookingsService.doneCancellation(+id);
  }
  @Patch('doneRefund/:id')
  @UseGuards(RolesGuard)
  @Roles(ALL_ADMINS)
  doneRefund(@Param('id') id: string) {
    return this.pnrBookingsService.doneRefund(+id);
  }
  @Patch('doneReIssue/:id')
  @UseGuards(RolesGuard)
  @Roles(ALL_ADMINS)
  doneReIssue(@Param('id') id: string) {
    return this.pnrBookingsService.doneReIssue(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pnrBookingsService.remove(+id);
  }
}
