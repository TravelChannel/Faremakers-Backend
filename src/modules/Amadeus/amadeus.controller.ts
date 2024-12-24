import {
  Controller,
  Post,
  Body,
  Res,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { AmadeusService } from './amadeus.service';
import { SkipAuth } from 'src/common/decorators/skip-auth.decorator';

@Controller('amadeus')
export class AmadeusController {
  constructor(private readonly amadeusService: AmadeusService) {}

  @Post('masterprice-travelboard')
  @SkipAuth()
  async getMasterPricetravelBoard(@Body() body: any, @Res() res: Response) {
    try {
      const result = await this.amadeusService.callMasterPriceTravelBoard(body);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      throw new HttpException(
        { success: false, message: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('masterprice-calender')
  @SkipAuth()
  async getMasterPriceCalender(@Body() body: any, @Res() res: Response) {
    try {
      const result = await this.amadeusService.callMasterPriceCalender(body);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      throw new HttpException(
        { success: false, message: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('fare-informative-bestpricing')
  @SkipAuth()
  async getFareInformativeBestPricing(@Body() body: any, @Res() res: Response) {
    try {
      const result =
        await this.amadeusService.callFareinformativeBestPricing(body);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      throw new HttpException(
        { success: false, message: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('airsell-from-recommendation')
  @SkipAuth()
  async getAirSellFromRecommedation(@Body() body: any, @Res() res: Response) {
    try {
      const result =
        await this.amadeusService.callAirSellFromRecommedation(body);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      throw new HttpException(
        { success: false, message: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
