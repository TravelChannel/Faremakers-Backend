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
} from '@nestjs/common';
import { Response } from 'express';

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
import { ADMIN_AND_USER_SUBJECT } from 'src/common/aclSubjects';

@Controller('pnrBooking')
export class PnrBookingsController {
  constructor(private readonly pnrBookingsService: PnrBookingsService) {}
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
  async processPayment(@Body() body: any, @Res() res: Response): Promise<any> {
    const { paymentData, paymentInfo } = body;

    // Step 1: Redirect to the payment gateway URL
    const paymentCode = 117547;
    const iframe_id = 134320;
    const paymentGatewayUrl =
      'https://pakistan.paymob.com/api/acceptance/iframes/${iframe_id}?payment_token=${paymentToken.token}'; // Replace with the actual URL
    res.redirect(HttpStatus.FOUND, paymentGatewayUrl);
    // return await this.pnrBookingsService.processPayment(
    //   currentUserId,
    //   isCurrentUserAdmin,
    //   pnrBookingDto,
    // );
    const paymentInfoToStore = {
      // Extract necessary payment information from the callback request or use paymentInfo from the original request
      // Example: paymentId, payerId, paymentStatus, etc.
      // Store this information in your database
    };
  }
  @Get()
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
  @Get('findByPnr')
  async findByPnr(@Req() req: Request): Promise<any> {
    return this.pnrBookingsService.findByPnr(req);
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

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pnrBookingsService.remove(+id);
  }
}
