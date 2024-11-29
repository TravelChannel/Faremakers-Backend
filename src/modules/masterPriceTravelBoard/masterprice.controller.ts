import {
  Controller,
  Post,
  Body,
  Res,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { MasterPriceService } from './masterprice.service';
import { SkipAuth } from 'src/common/decorators/skip-auth.decorator';

@Controller('masterprice')
export class MasterPriceController {
  constructor(private readonly travelBoardService: MasterPriceService) {}
  @Post('generate-envelope')
  @SkipAuth()
  async generateSOAPEnvelope(@Body() requestData: any): Promise<string> {
    return await this.travelBoardService.buildSOAPEnvelope(requestData);
  }

  @Post('masterprice-travelboard')
  @SkipAuth()
  async getMasterPricetravelBoard(@Body() body: any, @Res() res: Response) {
    try {
      const result =
        await this.travelBoardService.callMasterPriceTravelBoard(body);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      throw new HttpException(
        { success: false, message: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
