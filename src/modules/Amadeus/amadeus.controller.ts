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

  @Post('command-cryptic')
  @SkipAuth()
  async postCommandCrypticRQ(@Body() body: any, @Res() res: Response) {
    try {
      const result = await this.amadeusService.callCommandCryptic(body);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      throw new HttpException(
        { success: false, message: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

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

  @Post('fare-checkrules')
  @SkipAuth()
  async getFareCheckRules(@Body() body: any, @Res() res: Response) {
    try {
      const result = await this.amadeusService.callFareRulesCheck(body);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      throw new HttpException(
        { success: false, message: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('min-rules')
  @SkipAuth()
  async getMiniRules(@Body() body: any, @Res() res: Response) {
    try {
      const result = await this.amadeusService.callMiniRules(body);
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

  @Post('pnr-add-multielements')
  @SkipAuth()
  async postpnrAddMultiElements(@Body() body: any, @Res() res: Response) {
    try {
      const result = await this.amadeusService.callAddMultiElements(body);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      throw new HttpException(
        { success: false, message: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('add-form-of-payment')
  @SkipAuth()
  async postaddFormOfPayment(@Body() body: any, @Res() res: Response) {
    try {
      const result = await this.amadeusService.callAddFormofPayment(body);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      throw new HttpException(
        { success: false, message: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('fare_price_pnrwithbookingclass')
  @SkipAuth()
  async postfarePricePNRwithBookingClass(
    @Body() body: any,
    @Res() res: Response,
  ) {
    try {
      const result =
        await this.amadeusService.callFarePricePNRWithBookingClass(body);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      throw new HttpException(
        { success: false, message: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('ticket_create_tst_frompricing')
  @SkipAuth()
  async postTicketCreateTSTFromPricing(
    @Body() body: any,
    @Res() res: Response,
  ) {
    try {
      const result =
        await this.amadeusService.callTicketCreateTSTFromPricing(body);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      throw new HttpException(
        { success: false, message: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('doc_issuance_issuceticket')
  @SkipAuth()
  async postDocIssuance_IssueTicket(@Body() body: any, @Res() res: Response) {
    try {
      const result = await this.amadeusService.callDocIssuanceIssueTicket(body);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      throw new HttpException(
        { success: false, message: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('security_signout')
  @SkipAuth()
  async postSecuritySignOut(@Body() body: any, @Res() res: Response) {
    try {
      const result = await this.amadeusService.callEndSession(body);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      throw new HttpException(
        { success: false, message: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('retrive_pnr')
  @SkipAuth()
  async postRetrivePNR(@Body() body: any, @Res() res: Response) {
    try {
      const result = await this.amadeusService.callPNRRetrive(body);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      throw new HttpException(
        { success: false, message: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('cancel_pnr')
  @SkipAuth()
  async postCancelPNR(@Body() body: any, @Res() res: Response) {
    try {
      const result = await this.amadeusService.callCancelPNR(body);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      throw new HttpException(
        { success: false, message: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
